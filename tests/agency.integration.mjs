import { test } from "node:test";
import assert from "node:assert/strict";
import { request } from "@playwright/test";
const base = process.env.NEXTAUTH_URL || "";
if (
  process.env.AGENCY_TEST_DATABASE !== "isolated" ||
  !/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base)
)
  throw new Error("Run only against an explicit isolated local test database.");
const tls = process.env.AGENCY_TEST_TLS === "self-signed-local";
async function context() {
  return request.newContext({ baseURL: base, ignoreHTTPSErrors: tls });
}
async function login(ctx) {
  const csrf = await (await ctx.get("/api/auth/csrf")).json();
  const response = await ctx.post("/api/auth/callback/credentials", {
    form: {
      csrfToken: csrf.csrfToken,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      json: "true",
      callbackUrl: base + "/admin",
    },
  });
  assert.ok(response.ok());
  assert.equal(
    (await ctx.get("/api/admin/dashboard")).status(),
    200,
    "Real credentials must establish an authorized database-backed session.",
  );
}
const resources = [
  "dashboard",
  "projects",
  "services",
  "faqs",
  "testimonials",
  "bots",
  "skills",
  "certificates",
  "settings",
  "inbox",
  "chatlogs",
  "audit",
];
test("anonymous admin pages and every API reject access", async () => {
  const ctx = await context();
  try {
    for (const resource of resources)
      for (const method of ["GET", "POST", "PATCH", "DELETE"]) {
        const r = await ctx.fetch("/api/admin/" + resource, {
          method,
          data: method === "GET" ? undefined : {},
        });
        assert.equal(r.status(), 401);
        assert.match(r.headers()["cache-control"], /no-store/);
      }
    assert.equal((await ctx.post("/api/admin/upload")).status(), 401);
    const page = await ctx.get("/admin", { maxRedirects: 0 });
    assert.equal(page.status(), 307);
    assert.match(page.headers().location, /\/admin\/login/);
  } finally {
    await ctx.dispose();
  }
});
test("real login, CMS publication, durable inbox, lead management, audit and logout revocation", async (t) => {
  const ctx = await context();
  await login(ctx);
  try {
    const cookies = (await ctx.storageState()).cookies;
    const token = cookies.find((c) => c.name.includes("session-token"));
    assert.ok(token);
    assert.equal(token.httpOnly, true);
    assert.equal(token.sameSite, "Strict");
    if (base.startsWith("https:")) assert.equal(token.secure, true);
    await t.test("cross-origin mutation and strict schemas fail", async () => {
      assert.equal(
        (
          await ctx.post("/api/admin/faqs", {
            headers: { Origin: "https://attacker.example" },
            data: {},
          })
        ).status(),
        403,
      );
      assert.equal(
        (
          await ctx.post("/api/admin/faqs", {
            headers: { Origin: base },
            data: {
              id: "x",
              published: true,
              question: "A question",
              answer: "Answer",
              unexpected: "field",
            },
          })
        ).status(),
        422,
      );
      assert.equal((await ctx.get("/api/admin/inbox?page=-1")).status(), 422);
      assert.equal(
        (
          await ctx.post("/api/admin/testimonials", {
            headers: { Origin: base },
            data: {
              id: "fixture-review",
              name: "Test fixture",
              role: "Test only",
              quote: "Not genuine customer feedback.",
              portrait: "",
              published: true,
              permissionConfirmed: false,
            },
          })
        ).status(),
        422,
      );
    });
    const faq = {
      id: "fixture-agency-faq",
      question: "Integration fixture question?",
      answer: "Temporary integration fixture answer.",
      published: true,
    };
    await t.test(
      "FAQ publishing and unpublishing affect server-rendered content",
      async () => {
        assert.equal(
          (
            await ctx.post("/api/admin/faqs", {
              headers: { Origin: base },
              data: faq,
            })
          ).status(),
          200,
        );
        assert.ok((await (await ctx.get("/")).text()).includes(faq.question));
        assert.equal(
          (
            await ctx.post("/api/admin/faqs", {
              headers: { Origin: base },
              data: { ...faq, published: false },
            })
          ).status(),
          200,
        );
        assert.ok(!(await (await ctx.get("/")).text()).includes(faq.question));
      },
    );
    const service = {
      id: "fixture-service",
      title: "Integration service",
      description: "Temporary test service description.",
      detail: "A test fixture only.",
      tags: ["Fixture"],
      scope: ["Test behavior"],
      requirements: ["Test data"],
      published: true,
    };
    await t.test(
      "service details follow CMS publication and sitemap",
      async () => {
        assert.equal(
          (
            await ctx.post("/api/admin/services", {
              headers: { Origin: base },
              data: service,
            })
          ).status(),
          200,
        );
        assert.ok(
          (await (await ctx.get("/services/fixture-service")).text()).includes(
            service.title,
          ),
        );
        assert.ok(
          (await (await ctx.get("/sitemap.xml")).text()).includes(
            "/services/fixture-service",
          ),
        );
        assert.equal(
          (
            await ctx.post("/api/admin/services", {
              headers: { Origin: base },
              data: { ...service, published: false },
            })
          ).status(),
          200,
        );
        assert.ok(
          !(await (await ctx.get("/sitemap.xml")).text()).includes(
            "/services/fixture-service",
          ),
        );
      },
    );
    let inquiry;
    await t.test(
      "contact without SMTP persists and can be searched and managed",
      async () => {
        const result = await ctx.post("/api/contact", {
          headers: { Origin: base },
          data: {
            name: "Integration visitor",
            email: "fixture@example.test",
            company: "Temporary QA",
            service: "web",
            message:
              "A temporary automated inquiry used to verify database persistence.",
            website: "",
          },
        });
        assert.equal(result.status(), 202);
        const accepted = await result.json();
        assert.equal(accepted.acceptance, "stored");
        assert.equal(accepted.notification, "not-configured");
        const inbox = await (
          await ctx.get("/api/admin/inbox?q=fixture%40example.test")
        ).json();
        assert.ok(inbox.total >= 1);
        inquiry = inbox.items[0];
        assert.equal(inquiry.status, "new");
        assert.equal(inquiry.company, "Temporary QA");
        assert.equal(
          (
            await ctx.patch("/api/admin/inbox", {
              headers: { Origin: base },
              data: {
                id: inquiry.id,
                status: "contacted",
                notes: "Private QA note",
                read: true,
              },
            })
          ).status(),
          200,
        );
        const filtered = await (
          await ctx.get(
            "/api/admin/inbox?status=contacted&q=fixture%40example.test",
          )
        ).json();
        assert.equal(filtered.items[0].notes, "Private QA note");
        assert.equal(filtered.items[0].read, true);
        assert.equal(
          (
            await ctx.patch("/api/admin/inbox", {
              headers: { Origin: base },
              data: { id: inquiry.id, status: "invalid" },
            })
          ).status(),
          422,
        );
      },
    );
    await t.test(
      "dashboard and paginated audit are actual database results",
      async () => {
        const dashboard = await (await ctx.get("/api/admin/dashboard")).json();
        assert.ok(dashboard.messages >= 1);
        assert.ok(Array.isArray(dashboard.recent));
        const audit = await ctx.get("/api/admin/audit?size=2");
        assert.match(audit.headers()["cache-control"], /no-store/);
        const result = await audit.json();
        assert.equal(result.items.length, 2);
        assert.ok(result.total > 2);
      },
    );
    for (const [resource, id] of [
      ["faqs", faq.id],
      ["services", service.id],
      ...(inquiry ? [["inbox", inquiry.id]] : []),
    ])
      assert.equal(
        (
          await ctx.delete("/api/admin/" + resource, {
            headers: { Origin: base },
            data: { id },
          })
        ).status(),
        200,
      );
    await t.test(
      "signout revokes captured session tokens at the database boundary",
      async () => {
        const csrf = await (await ctx.get("/api/auth/csrf")).json();
        await ctx.post("/api/auth/signout", {
          form: {
            csrfToken: csrf.csrfToken,
            json: "true",
            callbackUrl: base + "/admin/login",
          },
        });
        assert.equal((await ctx.get("/api/admin/dashboard")).status(), 401);
        const replay = await context();
        try {
          const response = await replay.get("/api/admin/dashboard", {
            headers: { Cookie: `${token.name}=${token.value}` },
          });
          assert.equal(response.status(), 401);
        } finally {
          await replay.dispose();
        }
      },
    );
  } finally {
    await ctx.dispose();
  }
});

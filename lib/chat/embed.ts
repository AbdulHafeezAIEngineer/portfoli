import "server-only";
import { botContent, type RealBotConfig } from "@/data/bots";
import { ChatError, publicHttpsUrl } from "./http";
import { randomBytes } from "node:crypto";

const html = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

export function scriptDocument(
  config: Extract<RealBotConfig, { method: "script" }>,
): { document: string; policy: string } {
  const url = publicHttpsUrl(config.src);
  if (!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(config.mountId))
    throw new ChatError(503, "The widget mount is not configured correctly.");
  const attributes = Object.entries(config.attributes)
    .map(([key, value]) => {
      if (!/^data-[a-z0-9_-]+$/.test(key))
        throw new ChatError(
          503,
          "Widget attributes must be public data attributes.",
        );
      return `${key}="${html(value)}"`;
    })
    .join(" ");
  if (
    config.integrity &&
    !/^sha(256|384|512)-[A-Za-z0-9+/=]+$/.test(config.integrity)
  )
    throw new ChatError(503, "The widget integrity setting is invalid.");
  if (config.botpress) {
    const copy = botContent.chat;
    const configuration = publicHttpsUrl(config.botpress.configurationSrc);
    if (
      url.origin !== "https://cdn.botpress.cloud" ||
      !/^\/webchat\/v\d+\.\d+\/inject\.js$/.test(url.pathname) ||
      url.search ||
      url.hash ||
      configuration.origin !== "https://files.bpcontent.cloud" ||
      !/^\/[A-Za-z0-9/_-]+\.js$/.test(configuration.pathname) ||
      configuration.search ||
      configuration.hash
    )
      throw new ChatError(503, "The Botpress script addresses are invalid.");
    const nonce = randomBytes(18).toString("base64");
    const controller = `(function(){
      var root=document.getElementById('${config.mountId}');
      var status=document.getElementById('widget-status');
      var retry=document.getElementById('widget-retry');
      var active=true;
      var timer=setTimeout(fail,25000);
      function fail(){if(!active)return;clearTimeout(timer);status.hidden=false;status.textContent=${JSON.stringify(copy.embedUnavailable).replaceAll("<", "\\u003c")};retry.hidden=false;}
      function ready(){if(!active)return;clearTimeout(timer);try{window.botpress.open();status.hidden=true;retry.hidden=true;}catch(error){fail();}}
      retry.addEventListener('click',function(){location.reload();});
      window.addEventListener('pagehide',function(){active=false;clearTimeout(timer);});
      var loader=document.createElement('script');
      loader.src=root.dataset.loader;
      if(root.dataset.integrity){loader.integrity=root.dataset.integrity;loader.crossOrigin='anonymous';}
      loader.onerror=fail;
      loader.onload=function(){
        if(!active)return;
        var sdk=window.botpress;
        if(!sdk||typeof sdk.on!=='function'||typeof sdk.init!=='function'||typeof sdk.open!=='function'){fail();return;}
        sdk.on('webchat:ready',ready);
        var initialize=sdk.init.bind(sdk);
        sdk.init=function(options){return initialize(Object.assign({},options,{selector:'#${config.mountId}'}));};
        var configuration=document.createElement('script');
        configuration.src=root.dataset.configuration;
        configuration.onerror=fail;
        document.body.appendChild(configuration);
      };
      document.body.appendChild(loader);
    })();`;
    return {
      document: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${html(copy.embedTitle)}</title><style>html,body{height:100%;margin:0;background:#0a0a12;color:#f3f1eb;font:14px/1.6 system-ui}#${config.mountId}{height:100%;width:100%}#widget-loading{position:absolute;inset:0;display:grid;place-content:center;text-align:center;padding:24px;pointer-events:none}#widget-retry{pointer-events:auto;margin:12px auto;padding:10px 18px;border:1px solid #d4af37;border-radius:8px;background:#171720;color:#f3f1eb;cursor:pointer}#widget-retry[hidden]{display:none}#${config.mountId}>iframe,#bp-web-widget,.bpWebchat{position:fixed!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;border:0!important}</style></head><body><div id="widget-loading"><p id="widget-status" role="status">${html(copy.embedOpening)}</p><button id="widget-retry" type="button" hidden>${html(copy.embedRetry)}</button></div><div id="${config.mountId}" data-loader="${html(url.href)}" data-configuration="${html(configuration.href)}" data-integrity="${html(config.integrity || "")}"></div><script nonce="${nonce}">${controller}</script></body></html>`,
      policy: `default-src 'none'; script-src 'nonce-${nonce}' https://cdn.botpress.cloud https://files.bpcontent.cloud; style-src 'unsafe-inline' https:; img-src https: data: blob:; font-src https: data:; connect-src https: wss://chat.botpress.cloud; frame-src https://cdn.botpress.cloud https://webchat.botpress.cloud; worker-src blob:; base-uri 'none'; form-action https:; frame-ancestors 'self'`,
    };
  }
  return {
    document: `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Live chatbot widget</title><style>html,body{height:100%;margin:0;background:#0a0a12;color:#f3f1eb;font-family:system-ui}#${config.mountId}{height:100%}</style></head><body><div id="${config.mountId}"></div><script src="${html(url.href)}" ${attributes} ${config.integrity ? `integrity="${html(config.integrity)}" crossorigin="anonymous"` : ""} defer></script></body></html>`,
    policy: `default-src 'none'; script-src ${url.origin}; style-src 'unsafe-inline' https:; img-src https: data:; font-src https: data:; connect-src https:; frame-src https:; base-uri 'none'; form-action https:; frame-ancestors 'self'`,
  };
}

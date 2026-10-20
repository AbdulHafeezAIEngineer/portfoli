/** Original WebGL studies matching the requested Tunnel and Accretion directions.
 * References: shadcn.io/view/shaders/tunnel and /accretion.
 * These are local implementations, not redistributed shadcn source. */
export const featuredVertex = `attribute vec2 position;
void main(){ gl_Position=vec4(position,0.,1.); }`;

const shared = `
precision highp float;
uniform vec2 resolution;
uniform float time;
#define PI 3.14159265359
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);
}
float fbm(vec2 p){
 float n=0.,a=.5;
 for(int i=0;i<5;i++){n+=a*noise(p);p=mat2(1.6,1.2,-1.2,1.6)*p+3.7;a*=.5;}
 return n;
}
vec3 spectrum(float x){return .52+.48*cos(6.2831853*(x+vec3(0.,.33,.67)));}
`;

export const tunnelFragment = shared + `
void main(){
 vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
 p+=vec2(.06*sin(time*.13),.04*cos(time*.17));
 float r=length(p),a=atan(p.y,p.x);
 float depth=-log(max(r,.012));
 float travel=depth*3.8-time*.42;
 float twist=a+depth*.7+time*.07;
 float warp=.18*sin(twist*3.+depth*2.-time*.18)+.09*sin(twist*7.-depth*2.);
 float bands=pow(.5+.5*cos((travel+warp)*6.28318),14.);
 float fine=pow(.5+.5*cos((travel+warp)*37.7),22.);
 float ribs=pow(.5+.5*cos(twist*18.+sin(depth*3.)*.6),28.);
 vec3 violet=mix(vec3(.3,.12,.65),vec3(.08,.55,.8),.5+.5*sin(twist+depth*.5));
 vec3 hue=mix(violet,spectrum(depth*.13+sin(twist)*.22-time*.015),.4);
 float fade=smoothstep(.025,.16,r)*(1.-smoothstep(.85,1.8,r));
 vec3 col=vec3(.008,.006,.018)+hue*(bands*.8+fine*.22+ribs*.09)*fade;
 col+=hue*.07*exp(-r*.8)*fade;
 col*=.8+.2*fbm(vec2(cos(a),sin(a))*4.+depth*2.-time*.15);
 col=1.-exp(-col*1.35);
 gl_FragColor=vec4(col,1.);
}
`;

export const accretionFragment = shared + `
void main(){
 vec2 p=(gl_FragCoord.xy-.5*resolution)/min(resolution.x,resolution.y);
 p*=1.6;
 float r=length(p),a=atan(p.y,p.x),t=time*.1;
 vec3 col=vec3(.012,.016,.026);
 // Turbulent light orbiting an empty event horizon.
 vec2 circular=vec2(cos(a),sin(a))*3.;
 float turbulence=fbm(circular+vec2(r*7.-t*1.2,r*4.+t));
 float radius=.48+.024*sin(a*3.+t)+.018*sin(a*7.-t);
 float d=abs(r-radius);
 float strands=.5+.5*sin(r*210.+turbulence*14.-a*2.-t*5.);
 float ring=exp(-d*21.)*(.25+.75*strands);
 float core=exp(-abs(r-.455)*180.);
 vec3 cyan=vec3(.13,.62,.86),gold=vec3(1.,.55,.16);
 vec3 ringColor=mix(cyan,gold,.5+.5*sin(a*2.+turbulence*2.));
 col+=ringColor*ring*1.9+vec3(.84,.89,1.)*core*.8;
 col+=cyan*exp(-abs(r-.55)*12.)*.12;
 // An inclined accretion disk curls around the hole, with blue/gold filaments.
 float lens=.13*exp(-abs(p.x)*3.5)*sin(a);
 float axis=p.y-lens-.04*sin(p.x*5.+t);
 float spread=.065+.075*abs(p.x);
 vec2 flow=vec2(p.x*3.-t,axis*17.);
 float n=fbm(flow+vec2(fbm(flow+2.),fbm(flow-4.))*2.);
 float stream=exp(-abs(axis+(.5-n)*.16)/spread);
 float threads=pow(.5+.5*sin(axis*160.+n*15.+p.x*10.),5.);
 float outside=smoothstep(.39,.51,r);
 vec3 diskColor=mix(cyan,gold,smoothstep(.3,.72,n));
 col+=diskColor*stream*(.15+threads*2.5)*outside;
 col+=vec3(1.,.8,.42)*pow(stream,6.)*threads*outside*.7;
 col*=smoothstep(.405,.443,r);
 col+=vec3(.25,.43,.6)*exp(-abs(r-.44)*250.)*.3;
 col=1.-exp(-col*1.25);
 col*=1.-smoothstep(.8,1.7,r)*.65;
 gl_FragColor=vec4(col,1.);
}
`;

import { ArrowUpRight, ChevronLeft, MoreHorizontal, Paperclip, Smile, Mic, X } from "lucide-react";
import { botContent } from "@/data/bots";

export function FortePreview({ name }: { name: string }) {
  const copy = botContent.preview;
  return <div className="forte-preview" aria-hidden="true">
    <div className="forte-preview-header"><ChevronLeft size={15} /><span className="forte-preview-mark">{copy.mark}</span><div><strong>{name}</strong><span>{copy.subtitle}</span></div><MoreHorizontal size={18} /><X size={17} /></div>
    <div className="forte-preview-body"><span className="forte-preview-label">{copy.label}</span><strong>{copy.heading}</strong><p>{copy.description}</p><span className="forte-preview-invitation">{copy.invitation}<ArrowUpRight size={16} /></span></div>
    <div className="forte-preview-composer"><span>{copy.placeholder}</span><div><Paperclip size={14} /><Smile size={14} /><Mic size={14} /></div></div>
    <div className="forte-preview-powered">{copy.powered}</div>
  </div>;
}

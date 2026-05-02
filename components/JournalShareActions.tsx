"use client";

import { useEffect, useId, useState } from "react";
import { Link2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type JournalShareActionsProps = {
  title: string;
  url?: string;
  className?: string;
};

type ShareStatus = "idle" | "copied" | "shared" | "error";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M12.04 2.004c-5.523 0-10.002 4.477-10.002 10a9.96 9.96 0 0 0 1.453 5.198L2 22l4.967-1.455a9.968 9.968 0 0 0 5.072 1.312h.004c5.522 0 10-4.477 10-10a9.95 9.95 0 0 0-2.93-7.07 9.95 9.95 0 0 0-7.073-2.783Zm-.01 18.002h-.003a8.005 8.005 0 0 1-4.084-1.116l-.292-.173-2.946.864.883-2.87-.19-.295a8.007 8.007 0 0 1-1.225-4.21c0-4.417 3.6-8.016 8.018-8.016a7.94 7.94 0 0 1 5.66 2.346 7.948 7.948 0 0 1 2.339 5.67c0 4.418-3.599 8-8.01 8Zm4.647-6.312c-.252-.126-1.49-.735-1.72-.818-.23-.084-.397-.126-.564.126-.168.253-.648.818-.794.986-.147.168-.293.19-.545.063-.252-.127-1.064-.392-2.027-1.253-.75-.668-1.257-1.49-1.404-1.742-.146-.252-.016-.39.11-.516.114-.113.252-.293.379-.44.127-.146.168-.252.252-.42.084-.168.042-.314-.021-.44-.063-.127-.564-1.361-.773-1.863-.204-.49-.41-.424-.564-.432l-.48-.008c-.168 0-.44.063-.67.315-.23.252-.88.86-.88 2.095s.902 2.43 1.028 2.598c.126.168 1.77 2.703 4.29 3.787.6.259 1.07.414 1.436.53.603.193 1.15.166 1.583.1.483-.072 1.49-.608 1.7-1.196.21-.588.21-1.09.147-1.196-.063-.105-.23-.168-.482-.294Z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="35%" stopColor="#dd2a7b" />
          <stop offset="70%" stopColor="#8134af" />
          <stop offset="100%" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke={`url(#${gradientId})`} strokeWidth="2" />
      <circle cx="17" cy="7" r="1.25" fill={`url(#${gradientId})`} />
    </svg>
  );
}

function resolveShareUrl(url?: string) {
  if (url) return url;
  if (typeof window !== "undefined") return window.location.href;
  return "";
}

function buildShareText(title: string, url: string) {
  return `${title}\n${url}`;
}

export default function JournalShareActions({ title, url, className }: JournalShareActionsProps) {
  const [status, setStatus] = useState<ShareStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (status === "idle") return;

    const timeout = window.setTimeout(() => {
      setStatus("idle");
      setStatusMessage("");
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [status]);

  const currentUrl = resolveShareUrl(url);

  const announce = (nextStatus: ShareStatus, message: string) => {
    setStatus(nextStatus);
    setStatusMessage(message);
  };

  const copyLink = async () => {
    const shareUrl = resolveShareUrl(url);
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      announce("copied", "bağlantı kopyalandı");
    } catch {
      announce("error", "bağlantı kopyalanamadı");
    }
  };

  const shareViaNativeSheet = async () => {
    const shareUrl = resolveShareUrl(url);
    if (!shareUrl) return;

    const payload = {
      title,
      text: buildShareText(title, shareUrl),
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        announce("shared", "paylaşım menüsü açıldı");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyLink();
  };

  const shareViaWhatsApp = () => {
    if (!currentUrl) return;

    const text = encodeURIComponent(buildShareText(title, currentUrl));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
    announce("shared", "whatsapp açıldı");
  };

  return (
    <Card className={cn("overflow-hidden rounded-[1.5rem] border-white/10 bg-white/[0.03] shadow-none", className)}>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-zinc-400" />
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">paylaş</p>
          </div>
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-600">whatsapp · instagram · link</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            type="button"
            variant="ghost"
            className="h-12 justify-start rounded-[0.95rem] border border-emerald-400/20 bg-emerald-500/10 px-4 text-xs font-medium tracking-[0.12em] text-emerald-50 hover:bg-emerald-500 hover:text-white"
            onClick={shareViaWhatsApp}
          >
            <WhatsAppIcon className="mr-2 h-4 w-4" />
            whatsapp
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 justify-start rounded-[0.95rem] border border-pink-400/20 bg-pink-500/10 px-4 text-xs font-medium tracking-[0.12em] text-pink-50 hover:bg-pink-500 hover:text-white"
            onClick={shareViaNativeSheet}
          >
            <InstagramIcon className="mr-2 h-4 w-4" />
            instagram
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-12 justify-start rounded-[0.95rem] border border-white/10 bg-white/[0.04] px-4 text-xs font-medium tracking-[0.12em] text-white/80 hover:bg-white hover:text-zinc-950"
            onClick={copyLink}
          >
            <Link2 className="mr-2 h-4 w-4" />
            link kopyala
          </Button>
        </div>

        <p className="min-h-5 text-[0.72rem] uppercase tracking-[0.16em] text-zinc-500">
          {status === "idle" ? "bağlantıyı whatsapp, instagram veya link kopyala ile paylaşabilirsiniz." : statusMessage}
        </p>
      </CardContent>
    </Card>
  );
}

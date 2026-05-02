"use client";

import { useEffect, useState } from "react";
import { Link2, MessageCircle, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type JournalShareActionsProps = {
  title: string;
  url?: string;
  className?: string;
};

type ShareStatus = "idle" | "copied" | "shared" | "error";

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
    <Card className={cn("rounded-[1.5rem] border-white/10 bg-white/[0.03] shadow-none", className)}>
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-zinc-400" />
          <p className="text-[0.7rem] uppercase tracking-[0.3em] text-zinc-500">paylaş</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <Button
            type="button"
            variant="ghost"
            className="h-11 justify-start rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-xs uppercase tracking-[0.16em] text-white/80 hover:bg-white hover:text-zinc-950"
            onClick={shareViaWhatsApp}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            whatsapp
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 justify-start rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-xs uppercase tracking-[0.16em] text-white/80 hover:bg-white hover:text-zinc-950"
            onClick={shareViaNativeSheet}
          >
            <Share2 className="mr-2 h-4 w-4" />
            instagram
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="h-11 justify-start rounded-[0.9rem] border border-white/10 bg-white/[0.04] px-4 text-xs uppercase tracking-[0.16em] text-white/80 hover:bg-white hover:text-zinc-950"
            onClick={copyLink}
          >
            <Link2 className="mr-2 h-4 w-4" />
            link kopyala
          </Button>
        </div>

        <p className="min-h-5 text-[0.72rem] uppercase tracking-[0.16em] text-zinc-500">
          {status === "idle" ? "bağlantıyı whatsapp, instagram veya kopyala ile paylaşabilirsiniz." : statusMessage}
        </p>
      </CardContent>
    </Card>
  );
}

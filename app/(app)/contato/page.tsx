"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { Footer } from "@/components/ui/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { useAuth } from "@/hooks/useAuth";
import { getMyChurch, getPublicChurch } from "@/api-client/churches";
import { MailIcon, WhatsappIcon, PinIcon } from "@/components/icons";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

function whatsappHref(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

function ContatoContent() {
  const { user } = useAuth();

  const { data: church } = useQuery({
    queryKey: ["churches", user ? "me" : "public", user?.id],
    queryFn: () => (user ? getMyChurch() : getPublicChurch(CHURCH_SLUG)),
  });

  const contact = church?.contact;
  const email = contact?.email ?? "contato@principiosdevida.org.br";
  const whatsapp = contact?.whatsapp ?? "11 99999-0000";
  const address = church?.address ?? "Av. Principal, 1000 - Santo André/SP";
  const socialLinks = contact?.socialLinks ?? [];

  return (
    <>
      <Reveal as="section" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center md:max-w-5xl md:px-12 md:py-16">
          <h2 className="text-2xl font-bold md:text-4xl">Fale Conosco</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
            Envie sua mensagem, chame no WhatsApp ou nos siga nas redes sociais.
          </p>
        </div>
      </Reveal>

      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-5 pb-14 md:max-w-5xl md:px-12">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1px_1fr]">
            <ContactForm />

            <div className="hidden bg-divider md:block" />

            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
                <div>
                  <p className="text-sm font-semibold">E-mail</p>
                  <a href={`mailto:${email}`} className="text-sm text-text-muted hover:text-accent">
                    {email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <WhatsappIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
                <div>
                  <p className="text-sm font-semibold">WhatsApp</p>
                  <a
                    href={whatsappHref(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-accent"
                  >
                    {whatsapp}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
                <div>
                  <p className="text-sm font-semibold">Visite-nos</p>
                  <p className="text-sm text-text-muted">{address}</p>
                </div>
              </div>

              {socialLinks.length > 0 && (
                <div>
                  <p className="mb-2.5 text-sm font-semibold">Redes Sociais</p>
                  <SocialLinks links={socialLinks} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ContatoPage() {
  return (
    <AppShell active="/contato">
      <ContatoContent />
    </AppShell>
  );
}

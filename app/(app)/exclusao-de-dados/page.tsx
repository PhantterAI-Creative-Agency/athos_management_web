import { AppShell } from "@/components/ui/AppShell";
import { Footer } from "@/components/ui/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { DataDeletionRequestForm } from "@/components/legal/DataDeletionRequestForm";

function ExclusaoDeDadosContent() {
  return (
    <>
      <Reveal as="section" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 text-center md:px-12 md:py-16">
          <h1 className="text-2xl font-bold md:text-4xl">Exclusão de Dados do Usuário</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-muted">
            Você pode solicitar a exclusão dos seus dados pessoais cadastrados na Plataforma
            Princípios de Vida a qualquer momento.
          </p>
        </div>
      </Reveal>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-10 px-5 py-10 md:px-12 md:py-16 md:grid-cols-[1fr_1px_1fr]">
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-text-muted">
            <h2 className="text-section-title font-semibold text-foreground">Como funciona</h2>
            <p>
              Ao enviar uma solicitação de exclusão, nossa equipe removerá permanentemente os
              dados pessoais associados à sua conta — incluindo cadastro, atividade no mural,
              inscrições em eventos, ofertas registradas e demais informações vinculadas ao seu
              perfil — em até 30 dias, salvo obrigações legais que exijam retenção por período
              maior (ex.: registros fiscais de pagamentos).
            </p>
            <p>
              Você também pode solicitar a exclusão diretamente pelo aplicativo, em
              Configurações → Minha Conta → Excluir Conta, estando logado.
            </p>
            <p>
              Para solicitar sem acesso ao aplicativo, preencha o formulário ao lado com o email
              utilizado no seu cadastro.
            </p>
          </div>

          <div className="hidden bg-divider md:block" />

          <div>
            <h2 className="mb-5 text-section-title font-semibold">Solicitar exclusão</h2>
            <DataDeletionRequestForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function ExclusaoDeDadosPage() {
  return (
    <AppShell active="/exclusao-de-dados">
      <ExclusaoDeDadosContent />
    </AppShell>
  );
}

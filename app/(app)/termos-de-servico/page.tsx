import { AppShell } from "@/components/ui/AppShell";
import { Footer } from "@/components/ui/Footer";
import { Reveal } from "@/components/ui/Reveal";

const sections = [
  {
    title: "1. Aceitação dos Termos",
    body: "Ao acessar ou utilizar o aplicativo e o site da Princípios de Vida (\"Plataforma\"), você concorda com estes Termos de Serviço. Se você não concordar com algum destes termos, não utilize a Plataforma.",
  },
  {
    title: "2. Descrição do Serviço",
    body: "A Plataforma oferece funcionalidades de gestão eclesiástica e acompanhamento espiritual, incluindo cadastro de membros, eventos, grupos de crescimento, ministérios, mural, ofertas, devocionais, leitura bíblica e planos de leitura, entre outros recursos disponibilizados pela igreja.",
  },
  {
    title: "3. Cadastro e Conta do Usuário",
    body: "Para utilizar determinadas funcionalidades, é necessário criar uma conta com informações verdadeiras, completas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.",
  },
  {
    title: "4. Uso Aceitável",
    body: "Você concorda em não utilizar a Plataforma para fins ilícitos, ofensivos, difamatórios ou que violem direitos de terceiros. A igreja reserva-se o direito de suspender ou encerrar contas que violem estes Termos.",
  },
  {
    title: "5. Conteúdo do Usuário",
    body: "Ao publicar conteúdo na Plataforma (como no mural), você garante possuir os direitos necessários sobre esse conteúdo e concede à igreja licença para exibi-lo dentro da Plataforma. A igreja pode remover conteúdos que violem estes Termos ou os valores da comunidade.",
  },
  {
    title: "6. Pagamentos e Ofertas",
    body: "Ofertas, dízimos e inscrições em eventos pagos são processados por meio de provedores de pagamento parceiros. Ao realizar um pagamento, você concorda com os termos do respectivo provedor, além destes Termos de Serviço.",
  },
  {
    title: "7. Privacidade",
    body: "O tratamento de dados pessoais na Plataforma é regido por nossa Política de Privacidade, que descreve quais dados são coletados, como são utilizados e quais são os seus direitos, incluindo a possibilidade de solicitar a exclusão de seus dados.",
  },
  {
    title: "8. Propriedade Intelectual",
    body: "Todos os direitos sobre a Plataforma, incluindo marca, layout, textos e funcionalidades, pertencem à Princípios de Vida ou a seus licenciantes, sendo vedada a reprodução sem autorização prévia.",
  },
  {
    title: "9. Alterações nos Termos",
    body: "Estes Termos podem ser atualizados periodicamente. O uso continuado da Plataforma após uma alteração significa que você concorda com os novos termos.",
  },
  {
    title: "10. Limitação de Responsabilidade",
    body: "A Plataforma é fornecida \"como está\". A igreja não se responsabiliza por indisponibilidades temporárias, erros de conteúdo enviado por terceiros ou danos indiretos decorrentes do uso da Plataforma.",
  },
  {
    title: "11. Contato",
    body: "Em caso de dúvidas sobre estes Termos de Serviço, entre em contato através da página de Contato da Plataforma.",
  },
];

function TermosContent() {
  return (
    <>
      <Reveal as="section" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-12 md:py-16">
          <h1 className="text-2xl font-bold md:text-4xl">Termos de Serviço</h1>
          <p className="mt-3 text-sm text-text-muted">Última atualização: agosto de 2026</p>
        </div>
      </Reveal>

      <section className="bg-surface">
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 md:px-12 md:py-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 text-section-title font-semibold">{section.title}</h2>
              <p className="text-sm leading-relaxed text-text-muted">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function TermosDeServicoPage() {
  return (
    <AppShell active="/termos-de-servico">
      <TermosContent />
    </AppShell>
  );
}

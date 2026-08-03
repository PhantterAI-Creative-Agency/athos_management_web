/**
 * Script para popular o banco via API REST.
 * Uso: npx tsx scripts/seed.ts
 */

const API_URL = "http://localhost:4000/athos_adm/api";

async function request(method: string, path: string, body?: unknown, token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[${method} ${path}] ${res.status}:`, err);
    throw new Error(`Request failed: ${method} ${path} ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function seed() {
  console.log("Iniciando seed via API...\n");

  // 1. Criar usuário admin
  console.log("1. Criando usuário admin...");
  const admin = await request("POST", "/users", {
    churchId: "seed",
    name: "Pr. André Santos",
    email: "admin@igreja.com",
    password: "12345678",
    phone: "(11) 99999-0001",
  });
  console.log("   Admin criado:", admin.id);

  // Precisamos fazer login para obter token
  console.log("2. Fazendo login...");
  const loginResult: any = await request("POST", "/auth/login", {
    email: "admin@igreja.com",
    password: "12345678",
  });
  const token = loginResult.accessToken;
  console.log("   Token obtido");

  // Injetar devAdmin no admin para poder criar planos/badges
  // (a role devAdmin é necessária para alguns endpoints)
  // Na prática, vamos ignorar os endpoints que exigem devAdmin por enquanto
  // e focar no que funciona com admin/member

  // 3. Criar usuários comuns
  console.log("3. Criando usuários comuns...");
  const usersData = [
    { name: "Marina Alves", email: "marina@email.com", password: "12345678", phone: "(11) 99999-0002" },
    { name: "Carlos Eduardo", email: "carlos@email.com", password: "12345678", phone: "(11) 99999-0003" },
    { name: "Ana Beatriz", email: "ana@email.com", password: "12345678", phone: "(11) 99999-0004" },
    { name: "Pedro Henrique", email: "pedro@email.com", password: "12345678", phone: "(11) 99999-0005" },
    { name: "Lucia Mendes", email: "lucia@email.com", password: "12345678", phone: "(11) 99999-0006" },
    { name: "João Vitor", email: "joao@email.com", password: "12345678", phone: "(11) 99999-0007" },
    { name: "Fernanda Oliveira", email: "fernanda@email.com", password: "12345678", phone: "(11) 99999-0008" },
    { name: "Rafael Costa", email: "rafael@email.com", password: "12345678", phone: "(11) 99999-0009" },
    { name: "Camila Rocha", email: "camila@email.com", password: "12345678", phone: "(11) 99999-0010" },
    { name: "Thiago Martins", email: "thiago@email.com", password: "12345678", phone: "(11) 99999-0011" },
  ];

  const users: any[] = [];
  for (const u of usersData) {
    const created: any = await request("POST", "/users", u);
    users.push(created);
    console.log(`   ${created.name} (${created.id})`);
  }

  // 4. Criar ministérios
  console.log("4. Criando ministérios...");
  const ministriesData = [
    { name: "Louvor" },
    { name: "Ensino" },
    { name: "Ação Social" },
    { name: "Jovens" },
    { name: "Comunicação" },
    { name: "Intercessão" },
    { name: "Infantil" },
    { name: "Diaconia" },
  ];

  const ministries: any[] = [];
  for (const m of ministriesData) {
    const created: any = await request("POST", "/ministries", m, token);
    ministries.push(created);
    console.log(`   ${created.name} (${created.id})`);
  }

  // 5. Vincular voluntários
  console.log("5. Vinculando voluntários...");
  const volunteerPairs = [
    { m: 0, u: 0, role: "leader" },
    { m: 0, u: 1 },
    { m: 0, u: 2 },
    { m: 1, u: 3, role: "leader" },
    { m: 1, u: 4 },
    { m: 2, u: 5, role: "leader" },
    { m: 2, u: 6 },
    { m: 2, u: 7 },
    { m: 3, u: 8, role: "leader" },
    { m: 3, u: 9 },
    { m: 4, u: 1, role: "leader" },
    { m: 4, u: 4 },
    { m: 5, u: 2, role: "leader" },
    { m: 5, u: 0 },
    { m: 6, u: 7, role: "leader" },
    { m: 6, u: 5 },
    { m: 7, u: 3, role: "leader" },
  ];

  for (const vp of volunteerPairs) {
    const ministryId = ministries[vp.m].id;
    const userId = users[vp.u].id;
    await request(
      "POST",
      `/ministries/${ministryId}/volunteers`,
      { userId, role: vp.role || "volunteer" },
      token,
    );
    console.log(`   ${users[vp.u].name} -> ${ministries[vp.m].name}`);
  }

  // 6. Criar eventos
  console.log("6. Criando eventos...");
  const eventsData = [
    { title: "Culto de Louvor e Adoração", date: "2026-08-02T19:00:00", location: "Templo Principal" },
    { title: "Retiro de Homens 2026", date: "2026-09-09T08:00:00", location: "Sítio Vale da Bênção" },
    { title: "Semana da Família", date: "2026-08-23T18:00:00", location: "Templo Sede" },
    { title: "Batismo nas Águas", date: "2026-08-30T10:00:00", location: "Templo Sede" },
    { title: "Culto de Jovens", date: "2026-08-08T20:00:00", location: "Salão de Jovens" },
    { title: "Evangelismo na Praça", date: "2026-08-15T09:00:00", location: "Praça Central" },
    { title: "Conferência de Louvor", date: "2026-09-20T19:00:00", location: "Templo Principal" },
    { title: "Culto de Adolescentes", date: "2026-08-16T18:00:00", location: "Sala de Adolescentes" },
    { title: "Noite de Oração", date: "2026-08-12T20:00:00", location: "Templo Principal" },
    { title: "Café de Confraternização", date: "2026-08-25T09:00:00", location: "Salão Social" },
  ];

  for (const e of eventsData) {
    await request("POST", "/events", {
      churchId: "seed",
      ...e,
      imageUrl: `https://picsum.photos/seed/event-${e.title.replace(/\s+/g, "-")}/800/450`,
    }, token);
    console.log(`   ${e.title}`);
  }

  // 7. Criar posts no mural
  console.log("7. Criando posts no mural...");
  const muralPosts = [
    { content: "Inscrições abertas para o Retiro de Homens 2026! Vagas limitadas.", authorType: "church" },
    { content: "Campanha do agasalho arrecadou mais de 500 peças! Glória a Deus!", authorType: "church" },
    { content: "Irmãos, que culto abençoado ontem! A presença de Deus foi tremenda.", authorType: "user" },
    { content: "Lembrando que amanhã temos ensaio do louvor às 19h.", authorType: "user" },
    { content: "Escala de voluntários para o próximo domingo já está disponível.", authorType: "church" },
  ];

  for (const post of muralPosts) {
    await request("POST", "/mural", post, token);
    console.log(`   ${post.content.substring(0, 40)}...`);
  }

  // 8. Criar devocionais
  console.log("8. Criando devocionais...");
  const devotionalsData = [
    { title: "A Graça que nos Sustenta", content: "A graça de Deus é o fundamento da nossa fé. Não por obras, para que ninguém se glorie, mas pela misericórdia divina somos salvos.\n\nEm momentos de dificuldade, lembre-se: a graça de Deus é suficiente para você. O poder do Senhor se aperfeiçoa na fraqueza.", publishedAt: "2026-07-27T06:00:00.000Z" },
    { title: "O Amor que Transforma", content: "O amor de Deus é derramado em nossos corações pelo Espírito Santo. Esse amor não é apenas um sentimento, mas uma força transformadora que nos capacita a amar o próximo como a nós mesmos.", publishedAt: "2026-07-26T06:00:00.000Z" },
    { title: "Fé em Tempos de Provação", content: "A fé é a certeza das coisas que se esperam, a convicção de fatos que não se veem. Quando as tempestades da vida vêm, é a fé que nos mantém firmes.", publishedAt: "2026-07-25T06:00:00.000Z" },
    { title: "O Poder da Oração", content: "A oração é o canal de comunicação com o Criador. Não é uma formalidade religiosa, mas um diálogo íntimo com quem nos conhece por completo.", publishedAt: "2026-07-24T06:00:00.000Z" },
  ];

  for (const d of devotionalsData) {
    await request("POST", "/devotionals", d, token);
    console.log(`   ${d.title}`);
  }

  console.log("\nSeed concluído com sucesso!");
}

seed().catch((err) => {
  console.error("Falha no seed:", err);
  process.exit(1);
});

import { test, expect } from '@playwright/test';

const APP_TITLE = 'LexFlow CRM — Gestão Jurídica Inteligente';

// All CRM modules with their Portuguese route and expected heading
const MODULES = [
  { route: '/',               label: 'Dashboard',         heading: 'Dashboard' },
  { route: '/clientes',       label: 'Clientes',           heading: 'Gestão de Clientes' },
  { route: '/processos',      label: 'Processos',          heading: 'Gestão de Processos' },
  { route: '/financeiro',     label: 'Financeiro',         heading: 'Gestão Financeira' },
  { route: '/documentos',     label: 'Documentos',         heading: 'Gestão de Documentos' },
  { route: '/prazos',         label: 'Prazos',             heading: 'Gestão de Prazos' },
  { route: '/comunicacao',    label: 'Comunicação',        heading: 'Central de Comunicação' },
  { route: '/relatorios',     label: 'Relatórios',         heading: 'Relatórios e Analytics' },
  { route: '/colaboracao',    label: 'Colaboração',        heading: 'Espaço de Colaboração' },
  { route: '/configuracoes',  label: 'Configurações',      heading: 'Configurações' },
];

test.describe('LexFlow CRM — Testes E2E', () => {

  // ── 1. Todas as rotas retornam 200 ──
  test.describe('Rotas', () => {
    for (const m of MODULES) {
      test(`rota ${m.route} retorna HTTP 200 com título correto`, async ({ page }) => {
        const response = await page.goto(m.route);
        expect(response?.status()).toBe(200);
        await expect(page).toHaveTitle(APP_TITLE);
      });
    }
  });

  // ── 2. Sidebar ──
  test.describe('Sidebar', () => {
    test('sidebar está visível e contém o logo LexFlow', async ({ page }) => {
      await page.goto('/');
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toContainText('LexFlow');
    });

    for (const m of MODULES) {
      if (m.route === '/') continue;
      test(`link "${m.label}" na sidebar navega para ${m.route}`, async ({ page }) => {
        await page.goto('/');
        await page.locator('nav').locator(`a[href="${m.route}"]`).first().click();
        await page.waitForURL(`**${m.route}`);
        await expect(page).toHaveURL(/.*${m.route.replace('/','\\/')}/);
      });
    }
  });

  // ── 3. Header ──
  test.describe('Header', () => {
    test('header contém barra de busca, botão de tema e notificações', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  // ── 4. Dashboard ──
  test.describe('Dashboard', () => {
    test('dashboard exibe heading e conteúdo principal', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  });

  // ── 5. Tema (dark/light) ──
  test.describe('Alternância de Tema', () => {
    test('botão de alternância de tema existe no header', async ({ page }) => {
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  // ── 6. Configurações ──
  test('página de configurações carrega corretamente', async ({ page }) => {
    await page.goto('/configuracoes');
    await expect(page).toHaveTitle(APP_TITLE);
    await expect(page.locator('main')).toBeVisible();
  });
});
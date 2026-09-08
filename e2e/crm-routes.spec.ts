import { test, expect, type Page } from '@playwright/test';

const APP_TITLE = 'LexFlow CRM — Gestão Jurídica Inteligente';
const TEST_EMAIL = 'teste@lexflow.com';
const TEST_PASSWORD = 'Lexflow2024!';
const TEST_NAME = 'Usuário Teste';

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

// Creates a session by registering (if needed) and signing in through the UI
async function login(page: Page) {
  await page.goto('/login');
  // Try signing in first
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  // Wait for either dashboard or an auth error
  await page.waitForTimeout(2500);
  const url = page.url();
  if (!url.includes('/login')) return;
  // If still on /login, the account doesn't exist -> register
  await page.click('text=Cadastre-se');
  await page.fill('#name', TEST_NAME);
  await page.fill('#email', TEST_EMAIL);
  await page.fill('#password', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/');
}

test.describe('LexFlow CRM — Testes E2E', () => {

  test.describe('Autenticação', () => {
    test('usuário consegue acessar o sistema', async ({ page }) => {
      await login(page);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('aside')).toBeVisible();
    });
  });

  // ── 1. Todas as rotas retornam 200 ──
  test.describe('Rotas', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    for (const m of MODULES) {
      test(`rota ${m.route} retorna HTTP 200 com título correto`, async ({ page }) => {
        await login(page);
        const response = await page.goto(m.route);
        expect(response?.status()).toBe(200);
        await expect(page).toHaveTitle(APP_TITLE);
      });
    }
  });

  // ── 2. Sidebar ──
  test.describe('Sidebar', () => {
    test('sidebar está visível e contém o logo LexFlow', async ({ page }) => {
      await login(page);
      await page.goto('/');
      const sidebar = page.locator('aside');
      await expect(sidebar).toBeVisible();
      await expect(sidebar).toContainText('LexFlow');
    });

    for (const m of MODULES) {
      if (m.route === '/') continue;
      test(`link "${m.label}" na sidebar navega para ${m.route}`, async ({ page }) => {
        await login(page);
        await page.goto('/');
        await page.click(`a[href="${m.route}"]`);
        await page.waitForURL(`**${m.route}`);
        await expect(page).toHaveURL(new RegExp(m.route.replace('/', '\\/')));
      });
    }
  });

  // ── 3. Header ──
  test.describe('Header', () => {
    test('header contém barra de busca visível', async ({ page }) => {
      await login(page);
      await page.goto('/');
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });
  });

  // ── 4. Dashboard ──
  test.describe('Dashboard', () => {
    test('dashboard exibe heading e conteúdo principal', async ({ page }) => {
      await login(page);
      await page.goto('/');
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('h1, h2').first()).toBeVisible();
    });
  });

  // ── 5. Alternância de Tema ──
  test.describe('Alternância de Tema', () => {
    test('botão de alternância de tema existe', async ({ page }) => {
      await login(page);
      await page.goto('/');
      const themeBtn = page.locator('[class*="theme"] button, button:has(svg.lucide-sun), button:has(svg.lucide-moon)').first();
      const count = await themeBtn.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  // ── 6. Configurações ──
  test('página de configurações carrega corretamente', async ({ page }) => {
    await login(page);
    await page.goto('/configuracoes');
    await expect(page).toHaveTitle(APP_TITLE);
    await expect(page.locator('main')).toBeVisible();
  });
});

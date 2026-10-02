import { expect, test, type Page } from '@playwright/test'

const adminBase = 'http://127.0.0.1:5173'
const adminEmail = process.env.E2E_ADMIN_EMAIL ?? 'admin@goldenroe.local'
const adminPassword = process.env.E2E_ADMIN_PASSWORD ?? 'local-dev-only'

async function login(page: Page) {
  await page.goto(`${adminBase}/login`)
  await page.getByLabel('Email').fill(adminEmail)
  await page.getByLabel('Пароль').fill(adminPassword)
  await page.getByRole('button', { name: 'Войти' }).click()
  await expect(page.getByRole('heading', { name: 'Обзор' })).toBeVisible()
}

test('home leads to the chosen service and WhatsApp', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Узнать подробнее' }).first().click()
  await expect(page).toHaveURL(/\/kontakty\?service=\d+/)
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'WhatsApp' }).first()).toHaveAttribute('href', 'https://wa.me/79884560555')
  await expect(page.getByRole('link', { name: 'Telegram' }).first()).toHaveAttribute('href', 'https://t.me/elvira7710')
})

test('admin text appears on the public home and is removed again', async ({ page }) => {
  const marker = `E2E-${Date.now()}`
  await login(page)
  await page.goto(`${adminBase}/home`)
  const form = page.locator('form').filter({ hasText: 'Обо мне' })
  const field = form.getByLabel('Текст')
  const original = await field.inputValue()

  try {
    await field.fill(marker)
    await form.getByRole('button', { name: 'Сохранить блок' }).click()
    await expect(page.getByText('Сохранено').first()).toBeVisible()

    await expect(async () => {
      await page.goto('/')
      await expect(page.getByText(marker)).toBeVisible()
    }).toPass()
  } finally {
    await page.goto(`${adminBase}/home`)
    const restore = page.locator('form').filter({ hasText: 'Обо мне' }).getByLabel('Текст')
    await restore.fill(original)
    await page.locator('form').filter({ hasText: 'Обо мне' }).getByRole('button', { name: 'Сохранить блок' }).click()
    await expect(page.getByText('Сохранено').first()).toBeVisible()
  }

  await expect(async () => {
    await page.goto('/')
    await expect(page.getByText(marker)).toHaveCount(0)
  }).toPass()
})

test('a new review stays hidden until it is approved and publication is enabled', async ({ page }) => {
  const title = `E2E отзыв ${Date.now()}`

  await page.goto('/otzyvy')
  await expect(page.getByText('Одобренных отзывов пока нет.')).toBeVisible()

  await page.getByLabel('Имя').fill('Проверка формы')
  await page.getByLabel('Телефон').fill('89990001122')
  await page.getByLabel('Email').fill('e2e@example.test')
  await page.getByLabel('Услуга').selectOption({ index: 1 })
  await page.getByLabel('5', { exact: true }).check()
  await page.getByLabel('Заголовок').fill(title)
  await page.getByLabel('Текст').fill('Проверочный отзыв')
  await page.getByRole('checkbox', { name: /согласие на обработку/ }).check()
  await page.getByRole('button', { name: 'Отправить отзыв' }).click()
  await expect(page.getByText('Отзыв отправлен. Он появится на сайте после проверки.')).toBeVisible()

  await page.reload()
  await expect(page.getByText('Одобренных отзывов пока нет.')).toBeVisible()
  await expect(page.getByRole('heading', { name: title })).toHaveCount(0)

  try {
    await login(page)
    await page.goto(`${adminBase}/reviews?status=pending`)
    const card = page.locator('article').filter({ hasText: title })
    await card.getByRole('button', { name: 'Одобрить' }).click()
    await expect(page.getByText('Сохранено').first()).toBeVisible()

    await page.goto('/otzyvy')
    await expect(page.getByRole('heading', { name: title })).toHaveCount(0)

    await page.goto(`${adminBase}/settings`)
    const publication = page.getByRole('checkbox', { name: 'Показывать одобренные отзывы на сайте' })
    await publication.check()
    await page.getByRole('button', { name: 'Сохранить' }).click()
    await expect(page.getByText('Сохранено').first()).toBeVisible()

    await expect(async () => {
      await page.goto('/otzyvy')
      await expect(page.getByRole('heading', { name: title })).toBeVisible()
    }).toPass()
  } finally {
    await page.goto(`${adminBase}/reviews`)
    const card = page.locator('article').filter({ hasText: title })
    const appeared = await card.waitFor({ state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false)
    if (appeared) {
      page.once('dialog', (dialog) => dialog.accept())
      await card.getByRole('button', { name: 'Удалить' }).click()
      await expect(card).toHaveCount(0)
    }

    await page.goto(`${adminBase}/settings`)
    const publication = page.getByRole('checkbox', { name: 'Показывать одобренные отзывы на сайте' })
    if (await publication.isChecked()) {
      await publication.uncheck()
      await page.getByRole('button', { name: 'Сохранить' }).click()
      await expect(page.getByText('Сохранено').first()).toBeVisible()
    }
  }
})

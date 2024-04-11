import { test, expect, Page } from '@playwright/test'

const loginToLink = async(page: Page) =>{
    await page.goto('https://www.linkedin.com/')
    await page.getByLabel('Email or phone').click()
    await page.getByLabel('Email or phone').fill('yourMail')
    await page.getByLabel('Password', { exact: true }).click()
    await page.getByLabel('Password', { exact: true }).fill('yourPassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
}
test.setTimeout(10*60*1000)
test.describe('Base Tests',()=>{
test('Basic test @addConnections', async ({ page }) => {
    const pageAmount = 30
    const whoToAdd = 'talent acquisition'
    let totalConnectButtons = 0
    await loginToLink(page)
    await page.getByLabel('Search', {exact: true}).fill(whoToAdd)
    await page.keyboard.press('Enter')
    await page.getByRole('button', {name: 'People', exact:true }).click()
    try{
        for(let pageNumber = 1; pageNumber <=pageAmount; pageNumber++){
            console.info(`\x1b[34mAdd ${whoToAdd} on page ${pageNumber}\x1b`)
            await expect (page.locator('[data-view-name="search-entity-result-universal-template"]').nth(9)).toBeVisible()
            const connectButtons = await page.$$('[aria-label*= "Invite"][aria-label*= "to connect"]')
            const connectCount = connectButtons.length
            totalConnectButtons += connectCount
            for (let i = 0; i < connectCount; i++){
                await connectButtons[i].click()
                await page.getByLabel('Send now').click()
            }
            const nextButton = page.getByLabel('Next')
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            })
            await nextButton.click()
        }
        console.info(`\x1b[34mTotal connections sent: ${totalConnectButtons}\x1b`)
    }catch (error) {
            console.error('Error occurred:', error)
    }
})

test('Basic test @likeFeed', async ({ page }) => {
    const desiredLikesCount = 60
    await loginToLink(page)
    await page.goto('https://www.linkedin.com/feed/')
    let buttons = await page.$$('[data-test-icon="thumbs-up-outline-medium"]')
    while (buttons.length < desiredLikesCount) {
      // Scroll to the bottom of the page
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
  
      // Wait for some time for new buttons to load
      await page.waitForTimeout(500);
  
      // Count the number of buttons available in the DOM
      buttons = await page.$$('[data-test-icon="thumbs-up-outline-medium"]')
    }
    let sum = 0
    // Click on all buttons
    for (const button of buttons) {
      await button.click()
      sum++
    }
    console.info(`\x1b[34mTotal likes: ${sum}\x1b`)

})
})
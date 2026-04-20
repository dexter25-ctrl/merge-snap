import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # Create context with standard mobile viewport sizes if needed, or default
        context = await browser.new_context(viewport={'width': 412, 'height': 915})
        page = await context.new_page()

        # Navigate to the file
        await page.goto('file:///app/index.html')

        # Add a save state to localStorage to test the filled slot UI
        await page.evaluate("""
            localStorage.setItem('save_slot_1', JSON.stringify({
                level: 1,
                coins: 100,
                playerName: 'Dd',
                gender: 'homme',
                fogState: {}
            }));
        """)

        # Reload page to apply save
        await page.reload()

        # Wait for loading screen to hide
        await page.wait_for_selector('#loading-screen', state='hidden', timeout=10000)

        # Wait for start menu to be visible
        await page.wait_for_selector('#start-menu', state='visible')

        # Wait a moment for rendering
        await page.wait_for_timeout(1000)

        # Take a screenshot
        await page.screenshot(path='verification3.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(main())

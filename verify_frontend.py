from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")
        time.sleep(1)

        # Inject the correct local storage key to skip the creation screen
        page.evaluate("localStorage.setItem('mergeGameProfile', JSON.stringify({name: 'Jules', gender: 'male'}));")
        page.reload()
        time.sleep(1)

        # We might need to click "Reprendre la partie" if there is a start menu
        start_menu_visible = page.evaluate("document.getElementById('start-menu').style.display !== 'none'")
        if start_menu_visible:
            page.evaluate("resumeGame()")
            time.sleep(1)

        page.screenshot(path="/home/jules/verification/screenshots/verification_grid.png")
        print("Screenshot saved to /home/jules/verification/screenshots/verification_grid.png")
        browser.close()

if __name__ == "__main__":
    run()

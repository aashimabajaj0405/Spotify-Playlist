const puppeteer = require("puppeteer");

let tab;
playlistName = process.argv.slice(2).join(" ");
const id = "ratimof762@irahada.com";
const password = "aditi0405";

async function createPlaylist() {
    let browserPromise = await puppeteer.launch({
        headless : false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });
    let browser = await browserPromise;
    let pagesPromise = await browser.pages();
    tab = await pagesPromise[0];
    await tab.goto("https://open.spotify.com/");
    await tab.click("button[data-testid='login-button']");
    await tab.waitForNavigation({waitUntil : "networkidle2"});
    await tab.type("#login-username",id);
    await tab.type("#login-password",password);
    await tab.click("#login-button");
    await new Promise(function(resolve,reject){
        setTimeout(() => {
            resolve();
        },5000);
    });
    await tab.click("button[data-testid='create-playlist-button']");
    await tab.waitForSelector("ul[data-testid='rootlist'] > li");
    await tab.click("ul[data-testid='rootlist'] > li");
    await new Promise(function(resolve,reject){
        setTimeout(() => {
            resolve();
        },1500);
    });
    let playlistClass = "h1.a12b67e576d73f97c44f1f37026223c4-scss";
    await tab.click(playlistClass);
    await tab.focus("[placeholder='Add a name']");
    await tab.keyboard.down('Control');
    await tab.keyboard.press('A');
    await tab.keyboard.up('Control');
    await tab.keyboard.press('Backspace');
    await tab.type("input[placeholder='Add a name']",playlistName);
    await tab.click("button[data-testid='playlist-edit-details-save-button']");
    let tracksTag = await tab.$("a[href='/collection/tracks']");
    let tracksUrl = await tab.evaluate(function(ele){
        return ele.getAttribute("href");
    },tracksTag);
    await tab.goto("https://open.spotify.com" + tracksUrl);
    await tab.waitForSelector("button._605821ce181f6de6632eabd6a46377fb-scss");
    let songs = await tab.$$("button._605821ce181f6de6632eabd6a46377fb-scss");
    for(let i = 0;i < songs.length;i++){
        await songs[i].click();
        await new Promise(function(resolve,reject){
            setTimeout(() => {
                resolve();
            },1000);
        });
        let menuItems = await tab.$$("li.b46bba08e80cdd2d0da8cca1e49c7440-scss");
        await menuItems[6].click();
        await new Promise(function(resolve,reject){
            setTimeout(() => {
                resolve();
            },1000);
        });
        await tab.waitForSelector("ul[data-depth='1'] li button");
        let playlistOptions = await tab.$$("ul[data-depth='1'] li button");
        await playlistOptions[1].click();
    } 
    await tab.click("ul[data-testid='rootlist'] > li");
}

createPlaylist();
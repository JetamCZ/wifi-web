class Translations {
    constructor() {
        this.lang = {
            loading: "Načítání...",
            error: "Chyba!",
            before: "před",

            "component.nav.dashboard": "Dashboard",
            "component.nav.organization": "Organizace",
            "component.nav.maps": "Lokalizace",
            "component.nav.settings": "Nastavení",
            "component.nav.logout": "Odhlásit se",

            "components.authFooter.firstLine": "Locate.io - lokalizace wifi zařízení",
            "components.authFooter.secondLine": " maturitní projekt",

            "components.index.beacons.lastData": "poslední data před",

            "page.pageIndex.beacons": "Majáky",
            "page.pageIndex.activePeople": "Členové organizace",
            "page.pageIndex.activePeople.lastActivity": "v dosahu před",

            "page.pageOrganization.members": "Členové organizace",
            "page.pageOrganization.devices": "Zařízení členů organizace",
            "page.pageOrganization.beacons": "Majáky",
            "page.pageOrganization.members.name": "Jméno",
            "page.pageOrganization.members.lastActivity": "Poslední aktivita",
            "page.pageOrganization.members.invite": "Pozvat další členy",
            "page.pageOrganization.members.modal.title": "Přidání dalšího člena (Vygenerování zvacího kódu)",
            "page.pageOrganization.members.modal.info":
                "Pro pozvání dalšího člena organizace je zapotřebí vyvořit zvací odkaz, který je platný pouze 7 dní!",
            "page.pageOrganization.members.modal.newToken.clickme": "Klikni pro vygenerování zvacího odkazu",
            "page.pageOrganization.members.modal.newToken.getting": "Získávám odkaz... počkej",
            "page.pageOrganization.members.modal.newToken.done": "Tento odkaz zašli novému členovi!",
            "page.pageOrganization.members.modal.newToken.error": "Nastala chyba (zkus to později)",

            "page.pageOrganization.beacons.addModal.title": "Přidání majáku",
            "page.pageOrganization.beacons.addModal.desc":
                "Maják je fyzické zařízení, které složí k zachycení mobilních zařízení v jeho okolí.",
            "page.pageOrganization.beacons.name": "Název",
            "page.pageOrganization.beacons.desc": "Popis umístění",
            "page.pageOrganization.beacons.lastActivity": "Poslední data",
            "page.pageOrganization.beacons.addBeacon": "Přidat další maják",
            "page.pageOrganization.beacons.neverSeen": "Nikdy nepřišla data",

            "viewPerson.email": "Email",
            "viewPerson.devicesCount": "Počet zařízení",
            "viewPerson.lastActivity": "Poslední aktivita",
            "viewPerson.table.mac": "Mac adresa",
            "viewPerson.table.name": "Název zařízení",
            "viewPerson.table.lastActivity": "Poslední aktivita",
            "viewPerson.deleted": "Člen byl odebrán",
            "viewPerson.removeBtn": "Odebrat člena",
            "viewPerson.removeDevice": "Odebrat zařízení",

            "viewBeacon.lastSeen": "Poslední data",
            "viewBeacon.desc": "Popis umístění",
            "viewBeacon.table.mac": "Mac adresa",
            "viewBeacon.table.rssi": "Síla signálu",
            "viewBeacon.table.lastActivity": "Poslední aktivita",
            "viewBeacon.deleted": "Maják byl odebrán",
            "viewBeacon.removeBtn": "Odebrat maják",

            "page.page404.errorTitle": "Chyba 404",
            "page.page404.errorDesc": "Vámi hledaná stránka neexistuje. Prosím zkontrolujte zadanou URL adresu.",
            "page.page404.errorBackBtn": "Zpět na dashboard",

            "page.auth.createNewOrg.title": "Vytvoření nové organizace",
            "page.auth.createNewOrg.input.name": "Název organizace",
            "page.auth.createNewOrg.input.regKey": "Registrační klíč",
            "page.auth.createNewOrg.input.name.placeholder": "Zadejte název organizace",
            "page.auth.createNewOrg.backLogin": "zpět na přihlášení",
            "page.auth.createNewOrg.createNewOrg": "Vytvořit novou organizaci",
            "page.auth.createNewOrg.error.pathNameError": "Název organizace musí mít nejméně 3 znaky",
            "page.auth.createNewOrg.error.serverError": "Nastala chyba na straně serveru, zkuste to později",
            "page.auth.createNewOrg.error.code": "Váš registrační klíč je neplatný!",

            "page.auth.login.title": "Přihlášení",
            "page.auth.login.input.email": "Email",
            "page.auth.login.input.email.placeholder": "Zadej email",
            "page.auth.login.input.password": "Heslo",
            "page.auth.login.input.password.placeholder": "Zedej heslo",
            "page.auth.login.login": "Přihlášení",
            "page.auth.login.createOrg": "Vytvoření nové organizace",
            "page.auth.login.error.wrongCredentials": "Zadali jste špatné uživatelské jméno, nebo heslo.",
            "page.auth.login.error.tooManyRequests":
                "Zaslali jste příliš mnoho požadavků na server. Zkuste to později.",

            "page.auth.register.title": "Registrace člena organizace",
            "page.auth.register.input.email": "Email",
            "page.auth.register.input.email.placeholder": "Zadej email",
            "page.auth.register.input.name": "Jméno",
            "page.auth.register.input.name.placeholder": "Zadej jméno",
            "page.auth.register.input.password": "Heslo",
            "page.auth.register.input.password.placeholder": "Zedej heslo",
            "page.auth.register.input.passwordAgain": "Zadejte znovu heslo",
            "page.auth.register.input.passwordAgain.placeholder": "Zedejte znovu heslo",
            "page.auth.register.register": "Registrace",
            "page.auth.register.error.codeValidation": "Váš kód sloužící k registraci již není platný!",
            "page.auth.register.error.passwdAgain": "Znovu zadané heslo se neshoduje",
            "page.auth.register.error.shortName": "Zadejte jméno (minimálně 3 znaky)",
            "page.auth.register.error.password": "Heslo musí mít minimálně 4 znaky",
            "page.auth.register.error.email": "Vámi zadaný email je ve špatném formátu",
            "page.auth.register.backToLogin": "Přihlášení k již registrovanému účtu"
        }
    }

    getId(id) {
        return this.lang[id] || "ÁÁÁ - missing translation"
    }
}

export default new Translations()

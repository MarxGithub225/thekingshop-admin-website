export const generalConfig = {
    appName: 'The king shopsr',
    platformName: 'The king shopsr',
    defaultLanguage: 'fr',
    roles: ['admin'],
}

export const navBarConfig = {
    menus: [
        {
            display: 'Produits',
            route: 'products',
            icon: 'add_circle_outline'
        },
        {
            display: 'Commandes',
            route: 'orders',
            icon: 'add_circle_outline'
        },
        {
            display: 'Administrateurs',
            route: 'admins',
            icon: 'category'
        },
        {
            display: 'Catégories',
            route: 'categories',
            icon: 'shopping_basket'
        },
        {
            display: 'Bannières',
            route: 'banners',
            icon: 'add_circle_outline'
        }
    ],

    topBar : [
        
        {
            display : 'Mon profile',
            route: 'profil',
            icon: 'account_circle',
            link: false
        }
    ]
};
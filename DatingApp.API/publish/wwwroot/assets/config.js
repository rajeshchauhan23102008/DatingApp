export const DatingAppUIConfig =
{
    apiBaseURL: 'http://localhost:9999/',
    whitelistedDomainsName:
        ['localhost:9999', 'localhost:1234',
            'localhost:8000', 'localhost:9000'],
    blacklistedRoutesName:
        ['localhost:1234/api/auth/', 'localhost:8000/api/auth/',
            'localhost:9000/api/auth/', 'localhost:9999/api/auth/']
}
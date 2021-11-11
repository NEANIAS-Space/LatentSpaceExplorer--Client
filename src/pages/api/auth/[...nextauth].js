import NextAuth from 'next-auth';

export default NextAuth({
    providers: [
        {
            id: 'neanias',
            name: 'Neanias SSO',
            type: 'oauth',
            version: '2.0',
            scope: 'openid',
            params: { grant_type: 'authorization_code' },
            wellKnown: process.env.NEXTAUTH_WELL_KNOW_URL,
            authorizationUrl: process.env.NEXTAUTH_AUTHORIZATION_URL,
            accessTokenUrl: process.env.NEXTAUTH_ACCESS_TOKEN_URL,
            profileUrl: process.env.NEXTAUTH_PROFILE_URL,
            async profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: '',
                };
            },
            clientId: process.env.NEXTAUTH_CLIENT_ID,
            clientSecret: process.env.NEXTAUTH_CLIENT_SECRET,
            secret: process.env.NEXTAUTH_SECRET,
            debug: process.env.NEXTAUTH_DEBUG,
            useSecureCookies: process.env.NEXTAUTH_SECURE_COOKIES,
        },
    ],
});

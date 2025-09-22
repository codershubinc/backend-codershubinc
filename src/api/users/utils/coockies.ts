class cookies {
    create(res: any, session: any) {
        const maxAge = new Date(session.expire).getTime() - new Date().getTime();

        return res.cookie('session', session.secret, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: maxAge,
            path: '/',
        });
    }

    
}
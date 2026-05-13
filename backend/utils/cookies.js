const cookieOption = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,            //process.env.NODE_ENV === 'production', // set secure flag in production
    sameSite: 'none' // prevent CSRF attackss
}
export { cookieOption }
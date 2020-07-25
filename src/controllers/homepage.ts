export const homepage: any = (req: any, res: any) => {
    res.sendFile(__dirname + '/static/index.html');
}

export const js: any = (req: any, res: any) => {
    res.sendFile(__dirname + '/static/index.js')
}
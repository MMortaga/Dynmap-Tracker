export const homepage: any = (req: any, res: any) => {
    res.sendFile(__dirname + '/index.html');
}
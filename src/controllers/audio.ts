export const audio: any = (req: any, res: any) => {
    res.sendFile(__dirname + '/static/audio.wav');
}
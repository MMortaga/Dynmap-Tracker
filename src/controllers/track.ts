import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { Player } from './interfaces/Player';

dotenv.config();

export const track: any = (req: any, res: any) => {
    const dateTime: number = new Date().getTime();
    const worldIP: string = process.env.WORLD_IP;
    const sessionID: string = process.env.SESSION_ID;

    const myName: string = req.query.player_name;
    const dangerDistance: number = Number(req.query.danger_distance);

    fetch(`${worldIP}/up/world/world/${dateTime}`, {
        'headers': {
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9,ar;q=0.8,la;q=0.7',
            'x-requested-with': 'XMLHttpRequest',
            'cookie': `JSESSIONID=${sessionID}`
        },
        'method': 'GET',
    }).then(data => data.json()).then(data => {
        const players: Player[] = data.players;
        const me: Player = data.players.find((player: Player) => player.account === myName);
        if (!me) {
            res.json({ result: 'success', closest: [] });
            return;
        }
        const meX: number = me.x;
        const meZ: number = me.z;
        const myWorld: string = me.world;
        const closest: object[] = players.reduce((accumulator: object[], player: Player) => {
            const xDistance: number = meX - player.x;
            const zDistance: number = meZ - player.z;
            const distance: number = Math.hypot(xDistance, zDistance);
            if (
                distance > dangerDistance ||
                distance === 0 ||
                player.account === myName ||
                player.world !== myWorld
            ) { return accumulator }

            const account: string = player.account;
            accumulator.push({ [account]: Math.floor(distance) });
            return accumulator;
        }, [])

        res.json({ result: 'success', closest });
    }).catch(err => {
        res.status(500);
        // tslint:disable-next-line:no-console
        console.log(err);
        res.json({ result: 'ERR', err })
    });
}
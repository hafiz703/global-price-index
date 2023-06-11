import WebSocket from 'ws';
import { ExchangePort } from '../../interfaces/ExchangePort.js';
import { injectable, registry } from 'tsyringe';

@injectable()
@registry([{ token: 'Exchanges', useClass: BinanceExchangeAdapter }])
export class BinanceExchangeAdapter implements ExchangePort {
    private socket: WebSocket;
    private latestBestBid: number = 0;
    private latestBestAsk: number = 0;
    private readonly requestString: string = 'wss://stream.binance.com:9443/ws';
    private readonly depthStream: string = 'btcusdt@depth';
    constructor() {
        console.log("Binance constructor")
        this.socket = new WebSocket(this.requestString);
        this.socket.on('open', () => {
            this.socket.send(JSON.stringify({ method: 'SUBSCRIBE', params: [this.depthStream], id: 1 }));
        });

        this.socket.on('message', (data: WebSocket.Data) => {
            const message = JSON.parse(data.toString());
            try {
                this.latestBestBid = parseFloat(message['b'][0]);
            } catch (error) {
                console.error(message);
            }

            try {
                this.latestBestAsk = parseFloat(message['a'][0]);
            } catch (error) {
                console.error(message);
            }
        
        });

    }

    async getMidPrice(): Promise<number> {
        if (this.latestBestBid == 0 || this.latestBestAsk == 0) {
            return null;
        }
        const midPrice = (this.latestBestBid + this.latestBestAsk) / 2.0;
        console.log("Binance Mid :"+midPrice);
        return midPrice;
    }

}

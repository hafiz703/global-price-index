import WebSocket from 'ws';
import { ExchangePort } from '../../interfaces/ExchangePort.js';
import { injectable } from 'tsyringe';

@injectable()
export class BinanceExchangeAdapter implements ExchangePort {
    private socket: WebSocket;
    private latestBestBid: number = 0;
    private latestBestAsk: number = 0;
    private readonly requestString: string = 'wss://stream.binance.com:9443/ws';
    private readonly depthStream: string = 'btcusdt@depth';
    constructor(socket?: WebSocket) {
        this.socket = socket || new WebSocket(this.requestString);
        this.initializeWebSocket();
    }
    private initializeWebSocket(): void {
        this.socket.on('open', () => {
            this.socket.send(JSON.stringify({ method: 'SUBSCRIBE', params: [this.depthStream], id: 1 }));
        });

        this.socket.on('message', (data: WebSocket.Data) => {
            const streamData = JSON.parse(data.toString());
            try {
                this.latestBestBid = parseFloat(streamData['b'][0]);
            } catch (error) {
                console.error('Error parsing best bid:', error);
            }

            try {
                this.latestBestAsk = parseFloat(streamData['a'][0]);
            } catch (error) {
                console.error('Error parsing best ask:', error);
            }
        });

        this.socket.on('close', () => {
            console.log('WebSocket connection closed');
            this.latestBestBid = 0;
            this.latestBestAsk = 0;
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    async getMidPrice(): Promise<number> {
        if (this.socket == null || this.socket.readyState === this.socket.CLOSED) {
            this.initializeWebSocket();
        }
        if (this.latestBestBid == 0 || this.latestBestAsk == 0) {
            return null;
        }
        const midPrice = (this.latestBestBid + this.latestBestAsk) / 2.0;
        return midPrice;
    }

    getBestBid(): number{
        return this.latestBestBid;
    }
    getBestAsk(): number{
        return this.latestBestAsk;
    }
    getSocket(): WebSocket{
        return this.socket;
    }

}

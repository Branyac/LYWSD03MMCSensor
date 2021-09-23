class LYWSD03MMCSensor {
    constructor(device) {
        this.device = device;
        this.isMonitorModeEnabled = false;
    }

    async publishLogMessage(message) {
        let e = new CustomEvent('onLogMessage', { detail: { message: message } });
        document.dispatchEvent(e);
    }

    async publishMeasurement(temp, hum) {
        let e = new CustomEvent('onMeasurement', { detail: { temperature: temp, humidity: hum } });
        document.dispatchEvent(e);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startMonitor() {
        this.isMonitorModeEnabled = true;
        await this.publishLogMessage('Monitor mode started');

        do {
            await this.doMeasurement();
            await this.sleep(60000);
        } while (this.isMonitorModeEnabled)
    }

    async stopMonitor() {
        this.isMonitorModeEnabled = false;

        await this.publishLogMessage('Monitor mode finished');
    }

    async doMeasurement() {
        try {
            let connection = await this.connect();
            await this.getTempAndHumidity(connection);
        }
        catch (err) {
            await this.publishLogMessage('Error: ' + err);
        }
        finally {
            try {
                await this.disconnect();
            } catch { }
        }
    }

    async connect() {
        await this.publishLogMessage('Connecting to bluetooth device...');

        let connection = null;
        let retries = 0;
        do {
            if(retries > 3) {
                throw 'Can\'t connect to the device';
            }

            connection = await this.device.gatt.connect();
            retries++;
        }
        while (!this.device.gatt.connected);

        await this.publishLogMessage('Bluetooth connection established.');

        return connection;
    }

    async disconnect() {
        if (this.device.gatt.connected) {
            this.device.gatt.disconnect();
            await this.publishLogMessage('Bluetooth connection finished.');
        }
    }

    async getTempAndHumidity(gattServer) {
        let serviceMain = await gattServer.getPrimaryService('ebe0ccb0-7a0a-4b0c-8a1a-6ff2997da3a6');
        //await this.publishLogMessage("Found Main service");

        let nitifiyCharTemp = await serviceMain.getCharacteristic('ebe0ccc1-7a0a-4b0c-8a1a-6ff2997da3a6');
        //await this.publishLogMessage('Found Temp characteristic');

        await nitifiyCharTemp.startNotifications();

        let isMeasurementFinish = false;
        nitifiyCharTemp.addEventListener('characteristicvaluechanged', async event => {
            var value = event.target.value;
            var sign = value.getUint8(1) & (1 << 7);
            var temp = ((value.getUint8(1) & 0x7F) << 8 | value.getUint8(0));
            if (sign) temp = temp - 32767;
            temp = temp / 100;
            var hum = value.getUint8(2);

            await this.publishMeasurement(temp, hum);

            isMeasurementFinish = true;
        });

        while (!isMeasurementFinish) {
            await this.sleep(250);
        }
    }
}
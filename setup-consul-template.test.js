// Mock external modules by default
jest.mock('@actions/core');
jest.mock('@actions/tool-cache');
// Mock Node.js core modules
jest.mock('os');

const os = require('os');

const io = require('@actions/io');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const nock = require('nock');

const json = require('./test');
const setup = require('./setup-consul-template');

describe('Setup Consul-Template', () => {
    const HOME = process.env.HOME;
    const APPDATA = process.env.APPDATA;

    beforeEach(() => {
        process.env.HOME = '/tmp/asdf';
        process.env.APPDATA = '/tmp/asdf';
    });

    afterEach(async () => {
        await io.rmRF(process.env.HOME);
        process.env.HOME = HOME;
        process.env.APPDATA = APPDATA;
    });

    test('gets specific version and adds token and hostname on linux, amd64', async () => {
        const version = '0.29.2';

        core.getInput = jest
            .fn()
            .mockReturnValueOnce(version)

        tc.downloadTool = jest
            .fn()
            .mockReturnValueOnce('file.zip');

        tc.extractZip = jest
            .fn()
            .mockReturnValueOnce('file');

        os.platform = jest
            .fn()
            .mockReturnValue('linux');

        os.arch = jest
            .fn()
            .mockReturnValue('amd64');

        nock('https://releases.hashicorp.com')
            .get('/consul-template/index.json')
            .reply(200, json);

        const versionObj = await setup();
        expect(versionObj.version).toEqual('0.29.2');

        // downloaded CLI has been added to path
        expect(core.addPath).toHaveBeenCalled();
    });

    test('gets latest version and adds token and hostname on linux, amd64', async () => {
        const version = 'latest';

        core.getInput = jest
            .fn()
            .mockReturnValueOnce(version)

        tc.downloadTool = jest
            .fn()
            .mockReturnValueOnce('file.zip');

        tc.extractZip = jest
            .fn()
            .mockReturnValueOnce('file');

        os.platform = jest
            .fn()
            .mockReturnValue('linux');

        os.arch = jest
            .fn()
            .mockReturnValue('amd64');

        nock('https://releases.hashicorp.com')
            .get('/consul-template/index.json')
            .reply(200, json);

        const versionObj = await setup();
        expect(versionObj.version).toEqual('0.29.2');

        // downloaded CLI has been added to path
        expect(core.addPath).toHaveBeenCalled();

    });

});
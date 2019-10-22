const axios = require('axios');

exports.seed = function(knex) {
    return knex('patient-login').insert([
        {
            phoneNumber: '(650) 293-1740',
            loginTime: 0,
            clientId: 'reck4WW8RRKy9ftQL'
        },
        {
            phoneNumber: '(650) 281-7582',
            loginTime: 0,
            clientId: 'rec1CpLM0RxgOfXfx'
        },
        {
            phoneNumber: '(650) 576-5854',
            loginTime: 0,
            clientId: 'recFbg8Xut9INSq97'
        },
        {
            phoneNumber: '(650) 520-8440',
            loginTime: 0,
            clientId: 'rec43ppgrbQld6xPJ'
        },
        {
            phoneNumber: '+1 (415) 574-8711',
            loginTime: 0,
            clientId: 'recJ4qyzYTpT9Hxrw'
        },
        {
            phoneNumber: '(925) 639-1639',
            loginTime: 0,
            clientId: 'rec8DkcsKev4Q8EvF'
        },
        {
            phoneNumber: '(650) 863-5593',
            loginTime: 0,
            clientId: 'recvcNNwbeR1tcQcy'
        },
        {
            phoneNumber: '(650) 759-5968',
            loginTime: 0,
            clientId: 'recwowOaKFwn3w8u2'
        },
        {
            phoneNumber: '+1 (214) 546-1550',
            loginTime: 0,
            clientId: 'recHNadAko9IllrJN'
        },
        {
            phoneNumber: '(650) 771-0157',
            loginTime: 0,
            clientId: 'recpARanpf6BOQRb2'
        },
        {
            phoneNumber: '(650) 533-9319',
            loginTime: 0,
            clientId: 'recuSwRHMQxQ4NHir'
        },
        {
            phoneNumber: '(806)-518-8727',
            loginTime: 0,
            clientId: 'recpZcYGmNYfr3nAs'
        },
        {
            phoneNumber: '(650) 389-4935',
            loginTime: 0,
            clientId: 'rec5455owtuqLF61H'
        },
        {
            phoneNumber: '(650) 804-6320',
            loginTime: 0,
            clientId: 'rec7hIKfxUevH2XO6'
        },
        {
            phoneNumber: '(650) 867-4570',
            loginTime: 0,
            clientId: 'recKDz5LycCalk1Q7'
        },
        {
            phoneNumber: '(650) 679-2711',
            loginTime: 0,
            clientId: 'recc2PcCum0EyvzP3'
        }
    ]);
};

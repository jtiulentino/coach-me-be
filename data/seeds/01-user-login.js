const axios = require('axios');

exports.seed = function(knex) {
    return knex('patient-login').insert([
        {
            phoneNumber: '(650) 520-8440',
            loginTime: 0,
            clientId: 'recZdVVQtniTdLJh5'
        },
        {
            phoneNumber: '+1 (415) 574-8711',
            loginTime: 0,
            clientId: 'recEeW4905Rr9mJTS'
        },
        {
            phoneNumber: '(925) 639-1639',
            loginTime: 0,
            clientId: 'rec3NQI2MqXCQNQX1'
        },
        {
            phoneNumber: '(650) 863-5593',
            loginTime: 0,
            clientId: 'recqmjj6dqjztR2EU'
        },
        {
            phoneNumber: '(650) 759-5968',
            loginTime: 0,
            clientId: 'recry2kKMRYV3bkWo'
        },
        {
            phoneNumber: '+1 (214) 546-1550',
            loginTime: 0,
            clientId: 'recCXGJamABgl0Db9'
        },
        {
            phoneNumber: '(650) 771-0157',
            loginTime: 0,
            clientId: 'reckKnGXrry9Ov3Do'
        },
        {
            phoneNumber: '(806) 518-8727',
            loginTime: 0,
            clientId: 'reck9IugoZqNrIz2O'
        },
        {
            phoneNumber: '(650) 533-9319',
            loginTime: 0,
            clientId: 'recp22nhO2Zo4sTKN'
        },
        {
            phoneNumber: '(650) 293-1740',
            loginTime: 0,
            clientId: 'recfessIT3c69UFi7'
        },
        {
            phoneNumber: '(111) 111-1111',
            loginTime: 0,
            clientId: 'recPWedfYT2Op9PBw'
        },
        {
            phoneNumber: '(650) 389-4935',
            loginTime: 0,
            clientId: 'rec0eBBYyFWYLkit3'
        },
        {
            phoneNumber: '(123) 456-6789',
            loginTime: 0,
            clientId: 'recdONjMsbdrkHpeo'
        },
        {
            phoneNumber: '(650) 804-6320',
            loginTime: 0,
            clientId: 'rec2regPz6G3HH9gs'
        },
        {
            phoneNumber: '(650) 679-2711',
            loginTime: 0,
            clientId: 'rec7clIcwyscyaLhp'
        },
        {
            phoneNumber: '(650) 867-4570',
            loginTime: 0,
            clientId: 'recFN5BlAo4IlZdit'
        },
        {
            phoneNumber: '(650) 281-7582',
            loginTime: 0,
            clientId: 'recWMVhm23ZOOU9HT'
        },
        {
            phoneNumber: '(650) 576-5854',
            loginTime: 0,
            clientId: 'recAlMExwFBgNxCBt'
        }
    ]);
};

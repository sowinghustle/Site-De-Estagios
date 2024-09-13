'use strict';
const { createDefaultPreset } = require('ts-jest');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        ...createDefaultPreset().transform,
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                isolatedModules: true,
            },
        ],
    },
};

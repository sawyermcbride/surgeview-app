import {jest, describe, expect, test, beforeEach} from '@jest/globals';

import {query, testConnection} from '../../../db';
import YouTubeService from '../../../services/YouTubeService';
import app from '../../../index';
import request from 'supertest';

import generateToken from '../../../utils/jwtHelper';

const createToken = generateToken({email: 'samcbride11@gmail.com'}, false);

beforeEach(() => {
  jest.clearAllMocks();
})

test('5+5', () => {
  expect(5+5).toBe(10);
})
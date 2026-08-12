/**
 * MCP SSE 传输解析测试 — T17（parseSseEvents / SseStreamParser）
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseSseEvents, SseStreamParser } from '../../../services/mcp/sse.ts'

test('parseSseEvents：解析 event/data/id 帧', () => {
  const text = [
    'event: endpoint',
    'data: /messages?sessionId=abc',
    '',
    'id: 5',
    'data: hello',
    '',
    ': ping',
    'data: bare'
  ].join('\n')
  const events = parseSseEvents(text)
  assert.equal(events.length, 3)
  assert.equal(events[0].event, 'endpoint')
  assert.equal(events[0].data, '/messages?sessionId=abc')
  assert.equal(events[1].id, '5')
  assert.equal(events[1].data, 'hello')
  assert.equal(events[2].event, 'message')
  assert.equal(events[2].data, 'bare')
})

test('parseSseEvents：多行 data 合并、无 event 默认 message', () => {
  const text = ['data: line1', 'data: line2', '', 'event: x', 'data: 1', ''].join('\n')
  const events = parseSseEvents(text)
  assert.equal(events[0].data, 'line1line2')
  assert.equal(events[1].event, 'x')
  assert.equal(events[1].data, '1')
})

test('SseStreamParser：增量分块解析', () => {
  const parser = new SseStreamParser()
  const chunk1 = 'event: endpoint\ndata: /msg'
  const first = parser.push(chunk1)
  assert.equal(first.length, 0) // 未到空行边界
  const second = parser.push('\n\n')
  assert.equal(second.length, 1)
  assert.equal(second[0].event, 'endpoint')
  assert.equal(second[0].data, '/msg')
  // flush 尾部帧
  const tail = parser.push('event: message\ndata: {}')
  assert.equal(tail.length, 0)
  const flushed = parser.flush()
  assert.equal(flushed.length, 1)
  assert.equal(flushed[0].event, 'message')
})

test('SseStreamParser：CRLF 与注释心跳', () => {
  const parser = new SseStreamParser()
  const events = parser.push(': ping\r\n\r\nevent: message\r\ndata: {}\r\n\r\n')
  assert.equal(events.length, 1)
  assert.equal(events[0].event, 'message')
  assert.equal(events[0].data, '{}')
})

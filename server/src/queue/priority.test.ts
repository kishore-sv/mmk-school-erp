import { expect, test } from "bun:test"

import { priorityRank } from "./email-queue"

test("critical email jobs outrank lower priorities", () => {
  expect(priorityRank("critical")).toBeLessThan(priorityRank("high"))
  expect(priorityRank("high")).toBeLessThan(priorityRank("normal"))
  expect(priorityRank("normal")).toBeLessThan(priorityRank("low"))
})

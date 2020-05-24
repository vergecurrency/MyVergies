import { generateMenuTemplate } from "./menu"
import utils from '@/utils'

jest.mock('@/utils');
const mockedUtils = utils as jest.Mocked<typeof utils>

test("Menus should always have the same order", () => {
  mockedUtils.isMacOSEnvironment.mockImplementation(() => true)
  expect(generateMenuTemplate()).toHaveLength(5)
  expect(generateMenuTemplate()).toMatchSnapshot()
})

test("Menu should take MacOS into special consideration", () => {
  mockedUtils.isMacOSEnvironment.mockImplementation(() => false)
  expect(generateMenuTemplate()).toHaveLength(4)

  mockedUtils.isMacOSEnvironment.mockImplementation(() => true)
  expect(generateMenuTemplate()).toHaveLength(5)
})

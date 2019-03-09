import { div, render } from './framework'

const helloWorld = div({ className: 'tester' }, 'Hello World!')

render(helloWorld, '#root')

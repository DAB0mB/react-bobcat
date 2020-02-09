# Bobcat 😺😼

Bobcat is a library for testing navigation flows in React. Its API is heavily inspired by classic testing frameworks like [Mocha](https://mochajs.org/) and [Jest](https://jestjs.io/); it has a similar `describe()` / `it()` type of syntax.

### Usage

Here's a rough code snippet that demonstrates how Bobcat should be used:

```jsx
import { useState } from 'react';
import { useDelayedEffect, useBobcat } from 'react-bobcat';

import MyButton from './components/MyButton';
import { useSignOut } from './services/auth';

export default () => {
  const { scope, flow, trap, pass, assert } = useBobcat();

  scope('MyApp', () => {
    const signOut = useSignOut();

    before(async () => {
      await signOut();
    });

    flow('Clicking a button', () => {
      // MyButton is a React component
      trap(MyButton, ({ buttonRef, textRef }) => {
        const [buttonClicked, setButtonClicked] = useState(false);

        useDelayedEffect(() => () => {
          // buttonRef is referencing a native HTML button element
          buttonRef.current.click();
          setButtonClicked(true);
        }, 1000, [true]);

        useDelayedEffect(() => {
          if (!buttonClicked) return;

          return () => {
            assert(textRef.current.innerText, 'Clicked!')
            pass(); // Go to the next scope/flow
          };
        }, 1000, [buttonClicked]);
      });
    });

    scope('Another nested scope', () => {
      flow('Another flow A', () => {

      });

      flow('Another flow B', () => {

      });
    });
  });

  scope('You can also define additional external scopes', () => {
    flow('Etc', () => {

    });
  });
};
```

A more in-depth explanation and code snippets can be found on [Medium](https://medium.com/@eytanmanor/how-to-run-react-e2e-tests-purely-with-hooks-4bc475f4bb2).

### Installation

The source is available via [Github](github.com/dab0mb/react-bobcat). Alternatively you can install Bobcat via NPM:

    $ npm install react-bobcat

or Yarn:

    $ yarn add react-bobcat

*Be sure to install React@16.8 or greater*.

### License

MIT

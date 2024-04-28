# rhf-time-picker



## TODO
- [ ] classNameをclsxで結合する
- [x] デフォルトの時と分がオプションになかった場合どうするか
- [x] keyup / keydown で数値を変更できるようにする
- [ ] react-hook-formを入れて実際に試す
- [x] style={{}} を渡せるようにする
- [x] wai-ariaに対応する
- [ ] テストを書く?

## Install

```bash
npm i rhf-time-picker
```

## Usage

```tsx
import React from 'react';
import { useForm  } from 'react-hook-form';
import { TimePicker } from 'rhf-time-picker';

const App = () => {
  const { setValue, handleSubmit } = useForm();
  const onSubmit = (data) => {
      console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TimePicker
        name="time"
        setValue={setValue}
        defaultValue="12:00"
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Can I just use `{...register('time')}` like normal input elements?
 
Unfortunately no.

I couldn't find the way to fire `change` event on input elements for the life of me.
Except for using `input._valueTracker?.setValue()` which I'd like to avoid using.

So I resorted to using `setValue` function from `react-hook-form` to set the value.

### Props

### Change Colors
```tsx
// change select text color and background color
<TimePicker
    ...
    popupClassName={yourClassName}
/>

// change
```


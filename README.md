## TeleMedicine style guide corrections

#### 1. Indent: 2 spaces

#### 2. Luôn có semicolon

#### 3. Không inline styles

Mục đích: Quản lý tập trung, dùng lại styles

Ví dụ:

```javascript
import { StyleSheet } from 'react-native';

// Tạo 1 object `styles` độc lập ở cuối file và dùng trong toàn bộ component hiện tại

...
  render() {
    return (
      <View style={styles.container}>
        ...
      </View>
    );
  }
...

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});
```

Chú ý: có thể tách riêng styles ra thành 1 module trong trường hợp styles quá nhiều

Ví dụ:

```javascript
/*
 * @providesModule TeleMedicine.Components.Welcome.styles
 */

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  }
});
```

#### 4. Luôn có `@providesModule` ở đầu file

Mục đích: đây là chỉ báo cho React Native packager nhằm đảm bảo không có 2 module nào trong cùng 1 scope có implementation giống nhau
Sử dụng: đặt ở đầu các file `.js`
Cú pháp: `TeleMedicine.(Components|Constants|Models|Redux|Utils).X.Y.Z`, trong đó X, Y, Z là tên các Component theo thứ tự folder structure

Ví dụ:

```javascript
/*
 * @providesModule TeleMedicine.Components.Welcome
 */
```
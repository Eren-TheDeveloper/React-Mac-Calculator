# Hesap Makinesi

React, TypeScript ve Vite ile geliştirilmiş, macOS'tan esinlenen bir web hesap makinesi. Fare, dokunmatik ekran ve klavye ile kullanılabilir.

## Yerelde çalıştırma

Node.js 22.18 veya üzeri bir 22.x sürümü ya da Node.js 24 ve üzeri gerekir.

```sh
npm ci
npm run dev
```

Uygulamayı açmak için Vite'ın terminalde gösterdiği yerel adresi kullanın.

## Kullanım

| Tuş | İşlev |
| --- | --- |
| `0–9`, `+`, `-`, `*`, `/` | Sayı ve işlem girişi |
| `,` veya `.` | Ondalık ayırıcı |
| `%` | Yüzde |
| `=` veya `Enter` | Sonucu hesapla |
| `Backspace` | Son rakamı sil |
| `Esc` veya `Delete` | Tümünü temizle |
| `Tab` ve `Space` | Ekrandaki tuşlar arasında gezin ve odaklanan tuşa bas |

`Enter`, odak bir tuştayken o tuşu etkinleştirir. Sayılar Türkçe biçimde gösterilir. İşlemler giriş sırasına göre yürütülür ve `=` tuşuna tekrar basıldığında son işlem tekrarlanır. Örneğin `200 + 10 % =` işleminin sonucu `220` olur. Girdi 12 rakamla sınırlıdır ve sonuçlar 12 anlamlı basamağa yuvarlanır.

## Kontroller ve üretim derlemesi

```sh
npm run lint
npm test
npm run build
npm run preview
```

`dist/` klasörü statik barındırma için hazırdır. GitHub Actions, her gönderimde ve pull request'te lint, test ve derleme kontrollerini çalıştırır.

## GitHub'a yükleme

GitHub'da boş bir depo oluşturun. Aşağıdaki URL'de kullanıcı ve depo adını kendi bilgilerinizle değiştirin. [GitHub'ın yükleme kılavuzu](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

```sh
git remote add origin https://github.com/KULLANICI_ADI/DEPO_ADI.git
git push -u origin main
```

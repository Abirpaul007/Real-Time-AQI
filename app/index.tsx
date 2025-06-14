import { WebView } from 'react-native-webview';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('Login');
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        style={StyleSheet.absoluteFill}
        source={{
          html: `
            <html>
              <head>
                <script src="https://unpkg.com/css-doodle@0.29.0/css-doodle.min.js"></script>
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width:100%;
                    overflow: hidden;
                    background: #6838D4;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                </style>
              </head>
              <body>
                <css-doodle>
  <style>
    @grid: 50x1 / 50vmin;
    :container {
      perspective: 23vmin;
    }
    background: @m(
      @r(200, 240), 
      radial-gradient(
        @p(#00b8a9,rgb(115, 88, 233),rgb(15, 209, 235),rgb(16, 27, 185)) 15%,
        transparent 50%
      ) @r(100%) @r(100%) / @r(1%, 3%) @lr no-repeat
    );

    @size: 80%;
    @place-cell: center;

    border-radius: 50%;
    transform-style: preserve-3d;
    animation: scale-up 20s linear infinite;
    animation-delay: calc(@i * -.4s);

    @keyframes scale-up {
      0% {
        opacity: 0;
        transform: translate3d(0, 0, 0) rotate(0);
      }
      10% { 
        opacity: 1; 
      }
      95% {
        transform:
          translate3d(0, 0, @r(50vmin, 55vmin))
          rotate(@r(-360deg, 360deg));
      }
      100% {
        opacity: 0;
        transform: translate3d(0, 0, 1vmin);
      }
    }
  </style>
</css-doodle>
              </body>
            </html>
          `
        }}
      />

      <View style={styles.overlay}>
        <Image source={require('./(tabs)/logo.jpg')} style={styles.logo} />
        <Text style={styles.title}>ZenoAir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#222',
  },
});

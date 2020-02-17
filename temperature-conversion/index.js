import { fromEvent, pipe } from "rxjs";
import { pluck, map } from "rxjs/operators";

const scales = ["celsius", "fahrenheit", "kelvin"];

const converters = {
  celsius: {
    fahrenheit: celsiusToFahrenheit,
    kelvin: celsiusToKelvin
  },
  fahrenheit: {
    celsius: fahrenheitToCelsius,
    kelvin: pipe(fahrenheitToCelsius, celsiusToKelvin)
  },
  kelvin: {
    celsius: kelvinToCelsius,
    fahrenheit: pipe(kelvinToCelsius, celsiusToFahrenheit)
  }
};

const numberFormatter = Intl.NumberFormat("pl", {
  maximumFractionDigits: 2
});

const resetScales = () =>
  scales.forEach(scale => (document.getElementById(scale).value = ""));

scales.forEach(currentScale => {
  fromEvent(document.getElementById(currentScale), "input")
    .pipe(
      pluck("target", "value"),
      map(temp => temp.replace(",", "."))
    )
    .subscribe(temperature => {
      if (!temperature) {
        return resetScales();
      }

      scales
        .filter(targetScale => targetScale !== currentScale)
        .forEach(targetScale => {
          document.getElementById(targetScale).value = numberFormatter.format(
            converters[currentScale][targetScale](Number(temperature))
          );
        });
    });
});

function celsiusToFahrenheit(degrees) {
  return (degrees * 9) / 5 + 32;
}

function fahrenheitToCelsius(degrees) {
  return (degrees - 32) / (9 / 5);
}

function celsiusToKelvin(degrees) {
  return 273.15 + degrees;
}

function kelvinToCelsius(degrees) {
  return degrees - 273.15;
}

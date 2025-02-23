export const FormatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

export function FormatTerbilang(n: number): string {
  const angka: string[] = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan"];
    const tingkat: string[] = ["", "Ribu", "Juta", "Milyar", "Triliun"];

    if (n === 0) return "Nol";

    function satuan(num: number): string {
        if (num < 10) return angka[num];
        if (num < 20) return num === 10 ? "Sepuluh" : angka[num % 10] + " Belas";
        if (num < 100) return angka[Math.floor(num / 10)] + " Puluh " + angka[num % 10];
        return "";
    }

    function ratusan(num: number): string {
        if (num < 100) return satuan(num);
        if (num < 200) return "Seratus " + satuan(num % 100);
        return angka[Math.floor(num / 100)] + " Ratus " + satuan(num % 100);
    }

    let hasil: string = "";
    let i: number = 0;

    while (n > 0) {
        let bagian: number = n % 1000;
        if (bagian > 0) {
            let kata: string = ratusan(bagian);
            if (i === 1 && bagian === 1) kata = "Se";
            hasil = kata + " " + tingkat[i] + " " + hasil;
        }
        n = Math.floor(n / 1000);
        i++;
    }

    return hasil.trim() + " Rupiah"; 
}
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Separator } from "../ui/separator";
import { FormatRupiah, FormatTerbilang } from "@/lib/format";
import { useUser } from "@clerk/clerk-react";

// export default function PdfGenerator({ dataPage, copNumber }: { dataPage: any, copNumber: string }) {
export const PdfGenerator = forwardRef(({ dataPage, copNumber }: any, ref: any) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { user } = useUser()
    const generatePDF = async () => {
        if (!contentRef.current) return;

        const canvas = await html2canvas(contentRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210; // Lebar A4 dalam mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Menyesuaikan tinggi

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save("document.pdf");
    };

    const handleData = (val: string) => {
        if (val === 'QUOTE') {
            return 'Penawaran'
        } else if (val === 'SO') {
            return 'Surat Order'
        } else if (val === 'INV') {
            return 'Invoice'
        } else {
            return val
        }
    };

    const items = JSON.parse(dataPage.items);

    useImperativeHandle(ref, () => ({
        generatePDF,
    }));

    const Header = (val: string, status: string) => {
        if (val === 'QUOTE') {
            return `Dengan hormat,
    Bersama surat ini, kami dari ${dataPage?.company?.name} dengan penuh rasa hormat dan tanggung jawab mengajukan permohonan untuk ${handleData(dataPage?.type)}. Permohonan ini kami sampaikan sebagai bentuk keseriusan kami dalam memenuhi ketentuan serta prosedur yang berlaku. Adapun rincian lebih lanjut mengenai permohonan tersebut adalah sebagai berikut:`;
        }

        if (val === 'INV') {
            if (status === 'PAID') {
                return `Dengan hormat,
    Kami dari ${dataPage?.company?.name} mengonfirmasi bahwa pembayaran atas layanan/produk yang telah diberikan telah **diterima**. Terima kasih atas kerja sama yang telah terjalin. Berikut adalah rincian pembayaran sebagai referensi Anda.`;
            }
            return `Dengan hormat,
    Dengan ini kami dari ${dataPage?.company?.name} mengajukan tagihan atas layanan/produk yang telah diberikan sesuai dengan kesepakatan sebelumnya. Mohon untuk melakukan pembayaran sesuai dengan rincian yang tertera dalam dokumen ini.`;
        }

        if (val === 'SO') {
            return `Dengan hormat,
    Bersama surat ini, kami dari ${dataPage?.company?.name} mengonfirmasi pesanan yang telah disetujui sesuai dengan ketentuan yang berlaku. Adapun rincian pesanan yang bersangkutan adalah sebagai berikut:`;
        }

        if (val === 'DO') {
            return `Dengan hormat,
    Bersama dokumen ini, kami dari ${dataPage?.company?.name} menginformasikan bahwa pengiriman barang telah diproses sesuai dengan pesanan. Berikut adalah rincian pengiriman yang dilakukan:`;
        }

        return '';
    };

    const Footer = (val: string, status?: string) => {
        if (val === 'QUOTE') {
            return `Demikianlah permohonan ini kami sampaikan dengan penuh harapan agar dapat dipertimbangkan sebagaimana mestinya. Kami sangat menghargai waktu dan perhatian yang telah diberikan. Besar harapan kami agar permohonan ini dapat diterima dan memperoleh tanggapan yang baik.`;
        }
    
        if (val === 'INV') {
            if (status === 'PAID') {
                return `Terima kasih atas pembayaran yang telah dilakukan. Kami sangat menghargai kerja sama yang telah terjalin dan berharap dapat terus memberikan pelayanan terbaik untuk Anda.`;
            }
            return `Demikianlah tagihan ini kami sampaikan. Mohon untuk segera melakukan pembayaran sesuai dengan rincian yang tertera. Jika sudah melakukan pembayaran, mohon konfirmasi kepada kami. Terima kasih atas kerja sama Anda.`;
        }
    
        if (val === 'SO') {
            return `Pesanan ini telah kami proses sesuai dengan ketentuan yang berlaku. Jika terdapat hal yang perlu dikonfirmasi lebih lanjut, jangan ragu untuk menghubungi kami. Terima kasih atas kepercayaan Anda kepada ${dataPage?.company?.name}.`;
        }
    
        if (val === 'DO') {
            return `Pengiriman telah dilakukan sesuai dengan pesanan. Jika ada kendala atau pertanyaan mengenai pengiriman ini, silakan hubungi kami. Terima kasih atas kerja sama yang baik.`;
        }
    
        return `Atas perhatian, dukungan, serta kerja sama yang diberikan, kami mengucapkan terima kasih yang sebesar-besarnya.`;
    };
    

    return (
        <div className="p-4">
            <div ref={contentRef} className="bg-white p-4 shadow-lg rounded-md absolute -z-10 -top-1000 -left-1000 right-0 bottom-0">
                <h1 className="text-2xl text-center font-mono font-bold">{dataPage?.company?.name ?? ''}</h1>
                <p className="text-center font-mono text-sm">{dataPage?.company?.address ?? ''}</p>
                <p className="text-center font-mono text-sm">{dataPage?.company?.city && dataPage?.company?.country ? `${dataPage?.company?.city} - ${dataPage?.company?.country}` : ''}</p>
                <p className="text-center font-mono text-sm">Telp {dataPage?.company?.phone ?? ''} / Email {dataPage?.company?.email ?? ''}</p>
                <p className="text-center font-mono text-sm">Website {dataPage?.company?.website ?? ''}</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2">
                    <div className="grid grid-cols-2">
                        <div className="text-sm font-mono">
                            Perihal
                        </div>
                        <div className="text-sm font-mono font-bold">
                            : {handleData(dataPage?.type) ?? ''}
                        </div>
                        <div className="text-sm font-mono">
                            Nomor
                        </div>
                        <div className="text-sm font-mono font-bold">
                            : {copNumber}
                        </div>
                    </div>
                    <div className="text-sm font-mono text-right">
                        {`${dataPage?.company?.city}, ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}`}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-sm font-mono">
                        Kepada Yth.
                    </div>
                    {
                        dataPage?.customer?.jobTitle && dataPage?.customer?.fromCompany ? (
                            <div className="text-sm font-mono">
                                Bapak / Ibu  {dataPage?.customer?.jobTitle} {dataPage?.customer?.fromCompany}
                            </div>
                        ) : null
                    }
                    <div className="text-sm font-mono">
                        {dataPage?.customer?.jobTitle && !dataPage?.customer?.fromCompany ? `Bapak / Ibu  ${dataPage?.customer?.name}` : dataPage?.customer?.name}
                    </div>
                    <div className="text-sm font-mono">
                        {dataPage?.customer?.address ?? ''}
                    </div>
                    <div className="text-sm font-mono">
                        {dataPage?.customer?.city && dataPage?.customer?.country ? `${dataPage?.customer?.city} - ${dataPage?.customer?.country}` : ''}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-mono mt-8">
                       {Header(dataPage?.type, dataPage?.status)}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-mono mt-4">
                        Spesifikasi Produk
                    </div>
                </div>
                <div>
                    <div className="text-sm font-mono mt-4">
                        <table className="border-collapse w-full">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 bg-gray-200 p-2 w-10">No</th>
                                    <th className="border border-gray-300 bg-gray-200 text-left p-2">Nama Produk</th>
                                    <th className="border border-gray-300 bg-gray-200 text-left p-2">Jumlah</th>
                                    <th className="border border-gray-300 bg-gray-200 text-left p-2">Harga Satuan</th>
                                    <th className="border border-gray-300 bg-gray-200 text-left p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 && items.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{item.description}</td>
                                        <td className="border border-gray-300 p-2">{item.quantity}</td>
                                        <td className="border border-gray-300 p-2">{FormatRupiah(item.unitPrice)}</td>
                                        <td className="border border-gray-300 p-2">{FormatRupiah(item.unitPrice * item.quantity)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4} className=" p-2 text-right">Sub Total</td>
                                    <td className="border border-gray-300 p-2">{FormatRupiah(dataPage.subTotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className=" p-2 text-right">Pajak</td>
                                    <td className="border border-gray-300 p-2">{FormatRupiah(0)}</td>
                                </tr>
                                <tr className="font-bold">
                                    <td colSpan={4} className=" p-2 text-right">Total</td>
                                    <td className="border border-gray-300 p-2">{FormatRupiah(dataPage.total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div>
                    <div className="text-sm font-mono mt-8">
                        <span className="font-bold">
                            Terbilang : {' '}
                        </span>
                        {FormatTerbilang(dataPage.total)}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-mono mt-4">
                     {Footer(dataPage?.type, dataPage?.status)}
                    </div>
                    <div className="text-sm font-mono mt-4">
                        {`Atas perhatian, dukungan, serta kerja sama yang diberikan, kami mengucapkan terima kasih yang sebesar-besarnya.`}
                    </div>
                </div>
                <div className="mt-8 text-right">
                    <div className="text-sm font-mono mt-4 mb-16">
                        {`Hormat kami,`}
                    </div>
                    <div className="text-sm font-mono">
                        {user?.firstName + ' ' + user?.lastName}
                    </div>
                    <div className="text-sm font-mono">
                        {dataPage?.company?.name}
                    </div>
                </div>
                <div className="text-sm font-mono font-italic mt-16">
                    Dokumen ini dibuat secara otomatis melalui sistem Keps ERP v1.2.0 dan dapat diakses melalui https://kepsgurih-erp.vercel.app
                </div>
            </div>
        </div >
    );
});

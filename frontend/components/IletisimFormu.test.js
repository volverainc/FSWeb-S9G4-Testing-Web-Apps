import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />)
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>)
    const header = screen.queryByText("İletişim Formu");
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>)
    
    const adInput = screen.getByLabelText(/Ad*/);
    userEvent.type(adInput,"abc");

    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(1);

});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const button = screen.getByText(/Gönder/i);
    userEvent.click(button);

    const err = await screen.findAllByTestId("error");
    expect(err).toHaveLength(3);

});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const adInput = screen.getByPlaceholderText("İlhan");
    userEvent.type(adInput, "abcde")

    const soyadInput = screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput, "abcde")

    const button = screen.getByText(/Gönder/i);
    userEvent.click(button);

    const error = await screen.findAllByTestId("error")
    expect(error).toHaveLength(1)

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);

    const emailInput = screen.getByLabelText(/Email*/)
    userEvent.type(emailInput,"abc")

    const error = await screen.findByText(/email geçerli bir email adresi olmalıdır./i)
    expect(error).toBeInTheDocument()
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    render(<IletisimFormu/>);

    const soyadInput = screen.getByPlaceholderText("Mansız");
    userEvent.type(soyadInput, "")

    const button = screen.getByText(/Gönder/i);
    userEvent.click(button);

    const error = await screen.findByText(/soyad gereklidir./i)
    expect(error).toBeInTheDocument()

});

// test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
//     const adInput = screen.getByPlaceholderText("İlhan");
//     userEvent.type(adInput, "abcde")

//     const soyadInput = screen.getByPlaceholderText("Mansız");
//     userEvent.type(soyadInput, "abcde")

//     const emailInput = screen.getByLabelText(/Email*/)
//     userEvent.type(emailInput,"demo@example.com");

//     const button = screen.getByText(/Gönder/);
//     userEvent.click(button);

//     const ad = screen.queryByText("abcde")
//     expect(ad).toBeInTheDocument();

//     const soyad = screen.queryByText("abcde");
//     expect(soyad).toBeInTheDocument();

//     const email = screen.queryByText("demo@example.com")
//     expect(email).toBeInTheDocument();

//     const message = screen.queryByTestId("messageDisplay")
//     expect(message).not.toBeInTheDocument();
// });

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    render(<IletisimFormu/>);

    const name = screen.getByLabelText("Ad*");
    const surname = screen.getByLabelText("Soyad*");
    const mail = screen.getByLabelText("Email*");
    const message = screen.getByLabelText("Mesaj");
    const button = screen.getByRole("button");

    userEvent.type(name, "ornek");
    userEvent.type(surname, "soyad");
    userEvent.type(mail, "demo@example.com")
    userEvent.type(message, "mesaj");
    userEvent.click(button);

    await waitFor(() => {
        const message = screen.queryByTestId("messageDisplay");
        expect(name).toBeInTheDocument()
        expect(surname).toBeInTheDocument()
        expect(mail).toBeInTheDocument()
        expect(message).toBeInTheDocument()
    })
});

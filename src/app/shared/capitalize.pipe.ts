import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'capitalize'
})

export class CapitalizePipe implements PipeTransform {

    transform(value: string | undefined): string {
        if (!value) {
            return '';
        }

        // Teile den vollen Namen in Vorname und Nachname auf
        const names = value.split(' ');

        // Sichergehen, dass sowohl Vorname als auch Nachname vorhanden sind
        if (names.length < 2) {
            return '';
        }

        // Erste Buchstaben jedes Teils in Großbuchstaben umwandeln
        const firstNameInitial = names[0].charAt(0).toUpperCase();
        const lastNameInitial = names[1].charAt(0).toUpperCase();

        // Kombiniere die initialen Buchstaben zu einem einzelnen String
        const initials = firstNameInitial + lastNameInitial;

        return initials;
    }
}
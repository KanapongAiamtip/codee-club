import java.util.Scanner;
import java.util.Map;

class Example4Success {

    private static Map<String, String> dayToColor = Map.of(
        "monday", "Yellow",
        "tuesday", "Pink",
        "wednesday", "Green",
        "thursday", "Orange",
        "friday", "Blue",
        "saturday", "Purple",
        "sunday", "Red"
    );

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String day = sc.nextLine().toLowerCase();

        String color = dayToColor.get(day);
        System.out.print(color);
    }
}

import java.util.Scanner;
import java.util.Map;

class Example3Success {

    private static Map<Integer, String> dayToColor = Map.of(
        1, "Yellow", // Monday
        2, "Pink", // Tuesday
        3, "Green", // Wednesday
        4, "Orange", // Thursday
        5, "Blue", // Friday
        6, "Purple", // Saturday
        7, "Red" // Sunday
    );

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int dayInt = sc.nextInt();

        String color = dayToColor.get(dayInt);
        System.out.print(color);
    }
}

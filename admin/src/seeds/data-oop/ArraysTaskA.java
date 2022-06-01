import java.util.*;

class ArraysTaskA {

    public static void main(String[] args) {
        int[] numbers = inputIntArray();
        int result = sum(numbers);
        System.out.println(result);
    }

    public static int sum(int[] numbers) {
        int x = 0;
        for (int i = 0; i < numbers.length; i++) {
          x += numbers[i];
        }
        return x;
    }

    public static int[] inputIntArray() {
        Scanner reader = new Scanner(System.in);
        String input = reader.nextLine();
        String[] parts = input.split(",");

        int[] result = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            result[i] = Integer.parseInt(parts[i]);
        }
        return result;
    }
}
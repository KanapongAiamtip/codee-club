import java.util.*;

class ArraysTaskB {

    public static void main(String[] args) {
        String[] words = inputStringArray();
        String result = longWord(words);
        System.out.println(result);
    }

    private static String[] inputStringArray() {
        Scanner reader = new Scanner(System.in);
        String input = reader.nextLine();
        String[] result = input.split(",");
        return result;
    }

    public static String longWord(String[] words) {
      for (int i = 0; i < words.length; i++) {
        if (words[i].length() > 6) {
          return words[i];
        }
      }
      return "";
    }
}
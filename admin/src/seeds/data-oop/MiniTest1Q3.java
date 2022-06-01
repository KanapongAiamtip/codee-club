import java.util.Scanner;

class MiniTest1Q3 {

    public static void main(String[] args) {
	    Scanner sc = new Scanner(System.in);
        String str = sc.nextLine();
        for (int i = 0; i < str.length(); i++) {
            System.out.print('=');
        }
        System.out.println();
        System.out.println(str);
        for (int i = 0; i < str.length(); i++) {
            System.out.print('=');
        }
        System.out.println();
    }
}

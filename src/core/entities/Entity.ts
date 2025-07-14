export class Entity<Props> {
    // Vamos passar um genereric como props para poder Passar as propriedades para a classe que extendendo esta classe
    protected props: Props

    protected constructor(props: Props) {
        this.props = props
    }
}